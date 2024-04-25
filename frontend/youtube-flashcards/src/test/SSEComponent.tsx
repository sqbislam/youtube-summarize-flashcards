import { useState } from "react";

function SSEComponent() {
  const [progress, setProgress] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const handleButtonClick = () => {
    // Create an EventSource object to connect to the SSE endpoint
    const eventSource = new EventSource("http://localhost:8000/events");

    // Add event listener to handle incoming events
    eventSource.addEventListener("message", handleSSE);

    // Update state to indicate connection is established
    setIsConnected(true);
  };

  // Function to handle SSE messages
  const handleSSE = (event: MessageEvent<any>) => {
    // Parse the event data
    const eventData = JSON.parse(event.data);
    // Update the progress state with the received data
    setProgress(eventData);
  };

  return (
    <div>
      {!isConnected && (
        <button onClick={handleButtonClick}>Connect to Server</button>
      )}
      {isConnected && <p>Progress: {progress}</p>}
    </div>
  );
}

export default SSEComponent;
