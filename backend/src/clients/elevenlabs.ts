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
        model_id: 'eleven_turbo_v2_5',
        text,
      });

      const fileName = `${uuid()}.mp3`;
      const dirPath = path.join(__dirname, "../data/");
      mkdirSync(dirPath, { recursive: true });

      const filePath = path.join(dirPath, fileName);

      const fileStream = createWriteStream(filePath); // Opening file stream

      audio.pipe(fileStream);
      fileStream.on('finish', () => resolve(filePath)); // Resolve with the filePath
      fileStream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

// Wrapping the call in an async function
// const generateAudio = async () => {
//   try {
//     const filePath = await createAudioFileFromText('Hello World');
//     console.log(`Audio file generated: ${filePath}`);
//   } catch (error) {
//     console.error('Error generating audio:', error);
//   }
// };

// // Call the function to generate audio
// generateAudio();
