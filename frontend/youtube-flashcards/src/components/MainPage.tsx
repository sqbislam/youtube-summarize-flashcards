import {
  isValidYoutubeLink,
  checkValueInLocalStorage,
  setValueInLocalStorage,
} from "@/lib/utils";
import { Youtube } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { FlashCards } from "./FlashCards";
import { MetadataCard } from "./MetaDataCard";
import { SummaryCard } from "./SummaryCard";
import { YoutubeVideoCard } from "./YoutubeVideoCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Spinner from "./ui/spinner";
import { get_api_from_datatype } from "@/lib/api/base";
import { ResponseDataType } from "@/lib/interfaces/utilities";

function MainPage() {
  const [responseData, setResponseData] = useState<any>();
  const [ResponseDataType, setResponseDataType] =
    useState<ResponseDataType>("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const discardConcept = (index: number) => {
    if (
      responseData &&
      responseData.key_concepts &&
      responseData.key_concepts.length > 0
    ) {
      // Discard concept at that index
      const currArr = [...responseData.key_concepts];
      if (index >= 0) {
        currArr.splice(index, 1);
        setResponseData({ key_concepts: currArr });
      }
    }
  };
  const sendRequest = async (currResponseDataType: ResponseDataType) => {
    try {
      setLoading(true); // Start loading
      setResponseData(undefined); // Reset State
      setResponseDataType(currResponseDataType); // Set data type
      setError(""); // Reset Error if any
      // Add check for valid response
      const [videoID, valid] = isValidYoutubeLink(youtubeLink);
      if (!valid) {
        setError("Please enter a valid youtube link");
        return;
      }
      // Check if data is already in local storage
      const valueInLS = await checkValueInLocalStorage(
        videoID as any,
        currResponseDataType
      );
      if (videoID && valueInLS) {
        setResponseData(valueInLS);
        return;
      }

      const jsonRes = await get_api_from_datatype(currResponseDataType)(
        youtubeLink
      );

      // Set data in localstorage
      setValueInLocalStorage(videoID as any, jsonRes, currResponseDataType);
      setResponseData(jsonRes);
    } catch (e) {
      console.error("Something went wrong!", e);
      setError("Something went wrong! Please try again");
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setYoutubeLink(e.target.value);
  };
  return (
    <section className="mx-auto max-w-7xl lg:px-4 py-8">
      <div className="flex flex-col w-full justify-center items-center">
        <h1 className="text-2xl font-bold my-10">
          Youtube Flashcards{" "}
          <span>
            <Youtube color="red" className="inline-block" />
          </span>
        </h1>
        <div className="flex flex-col w-full max-w-sm items-center">
          <Input
            type="Youtube link"
            placeholder="Paste link here"
            onChange={handleChange}
          />

          {youtubeLink && <YoutubeVideoCard link={youtubeLink} />}
          <div className="flex flex-row space-x-2 mt-5">
            <Button
              type="submit"
              onClick={() => sendRequest("Metadata")}
              disabled={isLoading}
            >
              Metadata
            </Button>
            <Button
              type="submit"
              onClick={() => sendRequest("Summary")}
              disabled={isLoading}
            >
              Summarize
            </Button>
            <Button
              type="submit"
              onClick={() => sendRequest("Flashcards")}
              disabled={isLoading}
            >
              Flashcards
            </Button>
          </div>
        </div>
        <div className="mt-10 max-w-lg">
          {isLoading && <Spinner />}

          {responseData && ResponseDataType === "Summary" ? (
            <SummaryCard summary={responseData?.summary} />
          ) : responseData && ResponseDataType === "Metadata" ? (
            <MetadataCard data={responseData} />
          ) : (
            responseData &&
            responseData?.key_concepts && (
              <FlashCards
                keyConcepts={responseData.key_concepts as any}
                discardConcept={discardConcept}
              />
            )
          )}
          {error && error !== "" && <p>{error}</p>}
        </div>
      </div>
    </section>
  );
}

export default MainPage;
