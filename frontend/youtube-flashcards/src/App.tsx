import { ChangeEvent, useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import Spinner from "./components/ui/spinner";
import { FlashCards } from "./components/FlashCards";
import { SummaryCard } from "./components/SummaryCard";
import { MetadataCard } from "./components/MetaDataCard";
import { getYoutubeThumbnail, isValidYoutubeLink } from "./lib/utils";
import { ThemeProvider } from "./providers/ThemeProvider";
import { ModeToggle } from "./components/ThemeToggler";
import { Youtube } from "lucide-react";
import { YoutubeVideoCard } from "./components/YoutubeVideoCard";

type DataType = "Metadata" | "Summary" | "Flashcards" | "";

const apiRoutes = {
  "": "root",
  Metadata: "video_metadata",
  Summary: "summarize_video",
  Flashcards: "analyze_video",
};

function App() {
  const [responseData, setResponseData] = useState<any>();
  const [dataType, setDataType] = useState<DataType>("");
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
  const sendRequest = async (currdataType: DataType) => {
    try {
      // Add check for valid response
      if (!isValidYoutubeLink(youtubeLink)) {
        setError("Please enter a valid youtube link");
        return;
      }
      setLoading(true); // Start loading
      setResponseData(undefined); // Reset State
      setDataType(currdataType); // Set data type
      setError(""); // Reset Error if any
      const res = await fetch(
        `http://localhost:8000/${apiRoutes[currdataType]}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ youtube_link: youtubeLink }),
        }
      );

      const jsonRes = await res.json();
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
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ModeToggle />
        <section>
          <h1 className="text-2xl font-bold">
            Youtube Flashcards{" "}
            <span>
              <Youtube color="red" className="inline-block" />
            </span>
          </h1>
          <div className="flex flex-col w-full justify-center items-center mt-10">
            <div className="flex flex-col w-full max-w-sm items-center space-x-2">
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

              {responseData && dataType === "Summary" ? (
                <SummaryCard summary={responseData?.summary} />
              ) : responseData && dataType === "Metadata" ? (
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
      </ThemeProvider>
    </>
  );
}

export default App;
