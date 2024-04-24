import { ChangeEvent, useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardContent, CardTitle } from "./components/ui/card";
import Spinner from "./components/ui/spinner";

function App() {
  const [response, setResponse] = useState();
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isLoading, setLoading] = useState(false);
  const sendRequest = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/video_metadata", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ youtube_link: youtubeLink }),
      });

      const jsonRes = await res.json();
      setResponse(jsonRes);
    } catch (e) {
      console.error("Something went wrong!", e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setYoutubeLink(e.target.value);
  };
  return (
    <>
      <section>
        <h1 className="text-2xl font-bold">Youtube Flashcards</h1>
        <div className="flex flex-col w-full justify-center items-center mt-10">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="Youtube link"
              placeholder="Paste link here"
              onChange={handleChange}
            />
            <Button type="submit" onClick={sendRequest}>
              Generate
            </Button>
          </div>
          <div className="mt-10 max-w-sm">
            {isLoading && <Spinner />}
            {response && (
              <Card className="p-4 ">
                <CardTitle>Response</CardTitle>
                <CardContent>{JSON.stringify(response, null, 2)}</CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
