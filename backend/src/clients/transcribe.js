const { TranscribeStreamingClient, StartStreamTranscriptionCommand } = require("@aws-sdk/client-transcribe-streaming");
const fs = require("fs");
require("dotenv").config();

// AWS Region & Credentials from .env
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const SAMPLE_RATE = 16000; // Transcribe supports 16kHz PCM audio

class TranscribeService {
  constructor() {
    this.transcribeClient = new TranscribeStreamingClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async startStreaming(pcmFilePath, language, callback) {
    if (!fs.existsSync(pcmFilePath)) {
      throw new Error(`File not found: ${pcmFilePath}`);
    }

    const audioStream = fs.createReadStream(pcmFilePath);

    const command = new StartStreamTranscriptionCommand({
      LanguageCode: language,
      MediaEncoding: "pcm",
      MediaSampleRateHertz: SAMPLE_RATE,
      AudioStream: async function* () {
        for await (const chunk of audioStream) {
          yield { AudioEvent: { AudioChunk: chunk } };
        }
      },
    });

    try {
      const data = await this.transcribeClient.send(command);

      for await (const event of data.TranscriptResultStream) {
        if (event.TranscriptEvent?.Transcript?.Results?.length) {
          const results = event.TranscriptEvent.Transcript.Results;
          if (!results[0]?.IsPartial) {
            const newTranscript = results[0].Alternatives[0].Transcript;
            console.log("Transcription:", newTranscript);
            callback(newTranscript + " ");
          }
        }
      }
    } catch (error) {
      console.error("Transcription Error:", error);
      throw error;
    }
  }
}

module.exports = new TranscribeService();
