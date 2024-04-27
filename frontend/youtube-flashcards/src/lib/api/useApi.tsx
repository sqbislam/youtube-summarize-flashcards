import {
  isValidYoutubeLink,
  checkValueInLocalStorage,
  setValueInLocalStorage,
} from "@/lib/utils";
import { ChangeEvent, useEffect, useState } from "react";
import { apiBase, get_api_from_datatype } from "@/lib/api/base";
import { ResponseDataType } from "@/lib/interfaces/utilities";

const useAPI = () => {
  const [responseData, setResponseData] = useState<any>();
  const [ResponseDataType, setResponseDataType] =
    useState<ResponseDataType>("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isStreamLoading, setIsStreamLoading] = useState(false);
  const [error, setError] = useState("");
  const [summaryEventSource, setSummaryEventSource] = useState<
    EventSource | undefined
  >();

  useEffect(() => {
    // Close event  source  on unmount
    return () => {
      if (summaryEventSource) {
        summaryEventSource.close();
        setIsStreamLoading(false);
      }
    };
  }, []);

  const __reset_state = () => {
    setResponseData(undefined); // Reset State
    setError(""); // Reset Error if any
  };

  // Use LS value if present
  const __useCachedValue = async (
    videoID: string | boolean | undefined,
    currResponseDataType: ResponseDataType
  ) => {
    // Check if data is already in local storage
    const valueInLS = await checkValueInLocalStorage(
      videoID as any,
      currResponseDataType
    );
    if (videoID && valueInLS) {
      setResponseData(valueInLS);
      return true;
    }
    return false;
  };
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

  const sendRequestStream = async (currResponseDataType: ResponseDataType) => {
    __reset_state();
    setResponseDataType(currResponseDataType); // Set data type
    setIsStreamLoading(true); // Set Global loading
    try {
      // Add check for valid response
      const [videoID, valid] = isValidYoutubeLink(youtubeLink);
      if (!valid) {
        setError("Please enter a valid youtube link");
        return;
      }
      if (await __useCachedValue(videoID, currResponseDataType)) {
        return;
      }

      const eventSource = await apiBase.get_youtube_summary_stream(youtubeLink);
      if (eventSource) {
        setSummaryEventSource(eventSource);
      }
      // Add event listener to handle incoming events
      eventSource.addEventListener(
        "message",
        function (event: MessageEvent<any>) {
          setIsStreamLoading(true);
          // Update the progress state with the received data
          try {
            const parsedJSON = JSON.parse(event.data);

            const keyConcepts = [
              ...Object.keys(parsedJSON).map((key: string) => ({
                [key]: parsedJSON[key],
              })),
            ];
            setValueInLocalStorage(
              videoID as any,
              { key_concepts: keyConcepts },
              currResponseDataType
            );
            setResponseData({ key_concepts: keyConcepts });
            setLoading(false); // Remove global loading
          } catch (e) {
            console.warn("Output cannot be parsed" + event.data);
          }
        }
      );

      eventSource.addEventListener("end_event", function () {
        setIsStreamLoading(false);
        eventSource.close();
      });
    } catch (e) {
      console.error("Something went wrong!", e);
      setError("Something went wrong! Please try again");
    } finally {
      setLoading(false);
      setIsStreamLoading(false);
    }
  };
  const sendRequest = async (currResponseDataType: ResponseDataType) => {
    setLoading(true); // Start loading
    __reset_state(); // Reset State
    setResponseDataType(currResponseDataType); // Set data type
    try {
      // Add check for valid response
      const [videoID, valid] = isValidYoutubeLink(youtubeLink);
      if (!valid) {
        setError("Please enter a valid youtube link");
        return;
      }
      if (await __useCachedValue(videoID, currResponseDataType)) {
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

  return {
    handleChange,
    youtubeLink,
    sendRequest,
    sendRequestStream,
    isLoading,
    discardConcept,
    responseData,
    ResponseDataType,
    isStreamLoading,
    error,
  };
};

export default useAPI;
