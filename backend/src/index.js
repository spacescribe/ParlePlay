const express = require('express');
const dotenv = require('dotenv');
// const TranscribeService = require('./clients/transcribe');
const { transcribeAudio } = require('./clients/assembly.js');
const getDeepSeekResponse=require('./clients/deepseek.js');
const {createAudioFileFromText} =require('./clients/elevenlabs.js');
const cors=require('cors')

dotenv.config()

const app=express();
const PORT=process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
    res.send("Welcome to French API!!!");
})


app.get("/transcribe", async (req, res) => {
    try {
        const audioFilePath = "/Users/nandini.choukimath/Documents/Projects/French-bot/backend/heheh.mp3"; // Adjust path
        // const transcription = await transcribeAudio(audioFilePath);
        const deepSeekResponse = await getDeepSeekResponse("How are you?");
        createAudioFileFromText(deepSeekResponse);

        // res.json({ transcription, deepSeekResponse });
        res.json({deepSeekResponse});

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to transcribe audio" });
    }
});

  

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
