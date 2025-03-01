import dotenv from 'dotenv';
import fs from 'fs';
import { AssemblyAI } from 'assemblyai';
import path from 'path';

dotenv.config();

const ASSEMBLYAI_API = process.env.ASSEMBLYAI_API_KEY!;

if (!ASSEMBLYAI_API) throw new Error("API key not found");

const client = new AssemblyAI({ apiKey: ASSEMBLYAI_API });

/**
 * Uploads the audio file to AssemblyAI.
 * @param filePath The file path to the audio file.
 * @returns The audio file URL.
 */
async function uploadFiles(filePath: string): Promise<string> {
    if (!fs.existsSync(filePath)) {
        throw new Error("Audio file doesn't exist in the given path");
    }
    const fileBuffer = fs.readFileSync(filePath);
    const audioUrl: string = await client.files.upload(fileBuffer);
    return audioUrl;
}

/**
 * Transcribes the audio file and returns the transcription text.
 * @param filePath The file path to the audio file.
 * @returns The transcription text.
 */
async function transcribeAudio(filePath: string): Promise<string> {
    try {
        const audioUrl = await uploadFiles(filePath);
        console.log("Audio uploaded");

        const params = {
            audio: audioUrl,
            speaker_labels: true,
            language_code: 'fr'
        };

        while (true) {
            const transcript = await client.transcripts.transcribe(params);
            if (transcript.status === "completed") {
                return transcript.text ?? "";
            }
        }
    } catch (error) {
        console.error("Error in transcription:", error);
        throw error;
    }
}

export { transcribeAudio };
