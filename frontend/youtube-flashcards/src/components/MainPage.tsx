import { Youtube } from "lucide-react";
import { FlashCards } from "./FlashCards";
import { MetadataCard } from "./MetaDataCard";
import { SummaryCard } from "./SummaryCard";
import { YoutubeVideoCard } from "./YoutubeVideoCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Spinner from "./ui/spinner";
import useAPI from "@/lib/api/useApi";

function MainPage() {
  const {
    handleChange,
    youtubeLink,
    isLoading,
    sendRequest,
    discardConcept,
    sendRequestStream,
    isStreamLoading,
    ResponseDataType,
    responseData,
    error,
  } = useAPI();

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
              onClick={() => sendRequestStream("Flashcards")}
              disabled={isLoading || isStreamLoading}
            >
              Flashcards
            </Button>
          </div>
          {isStreamLoading && (
            <p className="text-accent text-sm mt-2">Fetching...</p>
          )}
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
