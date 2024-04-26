import { useState } from "react";

function SSEComponent() {
  const [progress, setProgress] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const handleButtonClick = () => {
    // Create an EventSource object to connect to the SSE endpoint
    const eventSource = new EventSource(
      `${
        import.meta.env.VITE_PRODUCTION_BACKEND_API_PATH
      }/test-stream/mE7IDf2SmJg`
    );

    // Add event listener to handle incoming events
    eventSource.onmessage = handleSSE;

    eventSource.addEventListener("end_event", function () {
      eventSource.close();
    });

    // Update state to indicate connection is established
    setIsConnected(true);
    // terminating the connection on component unmount
    return () => eventSource.close();
  };

  // Function to handle SSE messages
  const handleSSE = (event: MessageEvent<any>) => {
    // Parse the event data
    console.debug({ event });
    // Update the progress state with the received data
    setProgress(event.data);
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
