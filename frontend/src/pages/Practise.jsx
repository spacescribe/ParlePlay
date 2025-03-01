import { useEffect, useState, useRef } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import { useLocation } from "react-router-dom";

const Practise = () => {
    const [latestBlobUrl, setLatestBlobUrl] = useState(null);
    const [responseAudioUrl, setResponseAudioUrl] = useState(null);
    const [isActive, setIsActive] = useState(false); // Controls animation
    const [isPlaying, setIsPlaying] = useState(false); // Track AI audio play state
    const location = useLocation();
    const scenario = location.state.scenario;
    const audioRef = useRef(null);

    const handleUploadRecording = async (blobUrl) => {
        if (!blobUrl) return;

        try {
            const response = await fetch(blobUrl);
            const blob = await response.blob();

            const file = new File([blob], "recording.mp3", { type: "audio/mpeg" });

            const formData = new FormData();
            formData.append("audio", file);
            formData.append("scenario", JSON.stringify(scenario));

            const backendUrl = "http://localhost:3000/transcribe";

            const uploadResponse = await fetch(backendUrl, {
                method: "POST",
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error("Failed to fetch response audio");
            }

            const audioBlob = await uploadResponse.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            setResponseAudioUrl(audioUrl);
        } catch (error) {
            console.error("Error uploading recording:", error);
        }
    };

    useEffect(() => {
        if (latestBlobUrl) {
            handleUploadRecording(latestBlobUrl);
        }
    }, [latestBlobUrl]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.onplay = () => {
                setIsActive(true);
                setIsPlaying(true);
            };
            audioRef.current.onpause = () => {
                setIsActive(false);
                setIsPlaying(false);
            };
            audioRef.current.onended = () => {
                setIsActive(false);
                setIsPlaying(false);
            };
        }
    }, [responseAudioUrl]);

    const handleMicClick = (status, startRecording, stopRecording) => {
        if (status === "recording") {
            stopRecording();
        } else if (isPlaying) {
            audioRef.current.pause(); // Pause AI response audio
        } else {
            startRecording();
        }
    };

    return (
        <div className="practise-container">
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
                                className={`mic-button ${
                                    status === "recording" || isActive ? "active" : ""
                                }`}
                                onClick={() => handleMicClick(status, startRecording, stopRecording)}
                            >
                                <img src="../../public/icon.png" className="mic-icon" alt="Mic" />
                            </button>

                            {responseAudioUrl && (
                                <audio ref={audioRef} src={responseAudioUrl} autoPlay hidden />
                            )}
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default Practise;
