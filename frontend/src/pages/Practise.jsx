import { useEffect, useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder";

const Practise = () => {
    const [latestBlobUrl, setLatestBlobUrl] = useState(null);

    const handleUploadRecording = async (blobUrl) => {
        if (!blobUrl) return;

        try {
            // Fetch the recorded blob
            const response = await fetch(blobUrl);
            const blob = await response.blob();

            // Create a new file from the blob
            const file = new File([blob], "recording.mp3", { type: "audio/mpeg" });

            // Prepare FormData for upload
            const formData = new FormData();
            formData.append("audio", file);

            // Backend API URL
            const backendUrl = "http://localhost:3000/transcribe";

            // Upload to backend
            const uploadResponse = await fetch(backendUrl, {
                method: "POST",
                body: formData,
            });

            const result = await uploadResponse.json();
            console.log("Backend response:", result);
        } catch (error) {
            console.error("Error uploading recording:", error);
        }
    };

    // Automatically upload whenever a new recording is made
    useEffect(() => {
        if (latestBlobUrl) {
            handleUploadRecording(latestBlobUrl);
        }
    }, [latestBlobUrl]);

    return (
        <div className="container">
            <h1>Practice Your Speaking</h1>
            <p>Click the microphone to start recording</p>

            <ReactMediaRecorder
                audio
                render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
                    <div>
                        <button
                            className={`mic-button ${status === "recording" ? "recording" : ""}`}
                            onClick={() => {
                                if (status === "recording") {
                                    stopRecording();
                                } else {
                                    startRecording();
                                }
                            }}
                        >
                            🎤
                        </button>

                        {/* Update state when a new recording is available */}
                        {mediaBlobUrl && (
                            <div>
                                <audio controls src={mediaBlobUrl} />
                                {setLatestBlobUrl(mediaBlobUrl)}
                            </div>
                        )}
                    </div>
                )}
            />
        </div>
    );
};

export default Practise;
