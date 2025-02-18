const express = require('express');
const dotenv = require('dotenv');
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
        const audioFilePath = "/Users/nandini.choukimath/Documents/Projects/French-bot/backend/sample.mp3"; // Adjust path
        // const transcription = await transcribeAudio(audioFilePath);
        // const deepSeekResponse = await getDeepSeekResponse(transcription);
        const userMessage = req.body.userMessage;  
        console.log('User message:', userMessage);
        const deepSeekResponse = await getDeepSeekResponse(userMessage);
        // createAudioFileFromText(deepSeekResponse);

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
