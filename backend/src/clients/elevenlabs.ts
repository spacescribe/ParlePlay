import * as dotenv from 'dotenv';
import { ElevenLabsClient } from 'elevenlabs';
import { createWriteStream, mkdirSync } from 'fs';
import { v4 as uuid } from 'uuid';
import path from 'path';

dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

export const createAudioFileFromText = async (text: string): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const audio = await client.generate({
        voice: 'Rachel',
        language_code: 'fr',
        model_id: 'eleven_turbo_v2_5',
        text,
      });

      const fileName = `${uuid()}.mp3`;
      const dirPath = path.join(__dirname, "../data/");
      mkdirSync(dirPath, { recursive: true });

      const filePath = path.join(dirPath, fileName);

      const fileStream = createWriteStream(filePath);
      console.log(`Saving audio file to: ${filePath}`);

      audio.pipe(fileStream);

      fileStream.on('finish', () => {
        console.log(`Audio file successfully created at: ${filePath}`);
        resolve(filePath);  // Only resolve when file writing is complete
      });

      fileStream.on('error', (error) => {
        console.error("Error writing audio file:", error);
        reject(error);
      });

    } catch (error) {
      console.error("Error generating audio:", error);
      reject(error);
    }
  });
};
