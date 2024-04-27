import { IErrorResponse } from "../interfaces";
import {
  IGetMetadataResponse,
  IGetSummaryResponse,
  IGetVideoFlashcards,
  ResponseDataType,
} from "../interfaces/utilities";
import { getYoutubeVideoID } from "../utils";
import { apiCore } from "./core";

const jsonify = async (response: Response) => {
  if (response.ok) {
    return await response.json();
  } else {
    throw {
      message: `Request failed with ${response.status}: ${response.statusText}`,
      code: response.status,
    } as IErrorResponse;
  }
};

export const get_api_from_datatype = (data_type: ResponseDataType) => {
  switch (data_type) {
    case "Metadata":
      return apiBase.get_youtube_metadata;
    case "Summary":
      return apiBase.get_youtube_summary;
    case "Flashcards":
      return apiBase.get_youtube_flashcards;
    default:
      return apiBase.get_youtube_metadata;
  }
};

export const apiBase = {
  async get_youtube_metadata(urlLink: string): Promise<IGetMetadataResponse> {
    const res = await fetch(`${apiCore.url}/video_metadata`, {
      method: "POST",
      body: JSON.stringify({ youtube_link: urlLink }),
      headers: apiCore.headers(),
    });
    return (await jsonify(res)) as IGetMetadataResponse;
  },
  async get_youtube_summary(urlLink: string): Promise<IGetSummaryResponse> {
    const res = await fetch(`${apiCore.url}/summarize_video`, {
      method: "POST",
      body: JSON.stringify({ youtube_link: urlLink }),
      headers: apiCore.headers(),
    });
    return (await jsonify(res)) as IGetSummaryResponse;
  },
  async get_youtube_summary_stream(urlLink: string): Promise<EventSource> {
    const videoID = getYoutubeVideoID(urlLink);

    if (!videoID) {
      throw new Error("Invalid youtube link provided!");
    }
    const eventSource = new EventSource(
      `${apiCore.url}/test-stream/${videoID}`
    );

    return eventSource;
  },

  async get_youtube_flashcards(urlLink: string): Promise<IGetVideoFlashcards> {
    const res = await fetch(`${apiCore.url}/analyze_video`, {
      method: "POST",
      body: JSON.stringify({ youtube_link: urlLink }),
      headers: apiCore.headers(),
    });
    return (await jsonify(res)) as IGetVideoFlashcards;
  },
};
