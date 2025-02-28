import { useEffect, useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import { useLocation } from "react-router-dom";

const Practise = () => {
    const [latestBlobUrl, setLatestBlobUrl] = useState(null);
    const [responseAudioUrl, setResponseAudioUrl] = useState(null); // Store AI response audio
    const location = useLocation();
    const scenario = location.state.scenario;

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

            if (!uploadResponse.ok) {
                throw new Error("Failed to fetch response audio");
            }

            // Convert the response into a blob and create a URL for playback
            const audioBlob = await uploadResponse.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            setResponseAudioUrl(audioUrl); // Store AI response audio URL

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
            <p>Scenario: {scenario.title || "No scenario provided"}</p>

            <ReactMediaRecorder
                audio
                render={({ status, startRecording, stopRecording, mediaBlobUrl }) => {
                    useEffect(() => {
                        if (mediaBlobUrl) {
                            setLatestBlobUrl(mediaBlobUrl);
                        }
                    }, [mediaBlobUrl]);

                    return (
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

                            {/* Display the recorded audio */}
                            {mediaBlobUrl && (
                                <div>
                                    <p>Your Recording:</p>
                                    <audio controls src={mediaBlobUrl} />
                                </div>
                            )}

                            {/* Display and play the AI-generated response */}
                            {responseAudioUrl && (
                                <div>
                                    <p>AI Response:</p>
                                    <audio controls src={responseAudioUrl} autoPlay />
                                </div>
                            )}
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default Practise;
