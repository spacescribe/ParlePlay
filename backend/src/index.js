const express = require('express');
const dotenv = require('dotenv');
const multer = require("multer");
const { transcribeAudio } = require('./clients/assembly.js');
const getDeepSeekResponse=require('./clients/deepseek.js');
const {createAudioFileFromText} =require('./clients/elevenlabs.js');
const cors=require('cors');
const path =require('path');
const fs=require('fs');

dotenv.config()

const app=express();
const PORT=process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Configure Multer for handling file uploads
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });


app.get('/', (req, res)=>{
    res.send("Welcome to French API!!!");
})


// app.get("/transcribe", async (req, res) => {
//     try {
//         const audioFilePath = "/Users/nandini.choukimath/Documents/Projects/French-bot/backend/sample.mp3"; // Adjust path
//         // const transcription = await transcribeAudio(audioFilePath);
//         // const deepSeekResponse = await getDeepSeekResponse(transcription);
//         const userMessage = req.body.userMessage;  
//         console.log('User message:', userMessage);
//         const deepSeekResponse = await getDeepSeekResponse(userMessage);
//         // createAudioFileFromText(deepSeekResponse);

//         // res.json({ transcription, deepSeekResponse });
//         res.json({deepSeekResponse});

//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: "Failed to transcribe audio" });
//     }
// });

app.post("/transcribe", upload.single("audio"), async (req, res) => {
    let tempFilePath; // Declare outside so it's accessible in finally

    try {
        if (!req.file) {
            return res.status(400).json({ error: "No audio file uploaded" });
        }

        console.log("Received file:", req.file.originalname);

        // Save buffer to a temporary file
        tempFilePath = path.join(__dirname, "temp_audio.mp3");
        fs.writeFileSync(tempFilePath, req.file.buffer);

        // Transcribe using the temporary file path
        const transcription = await transcribeAudio(tempFilePath);
        const deepSeekResponse = await getDeepSeekResponse(transcription);

        createAudioFileFromText(deepSeekResponse);

        res.json({ transcription, deepSeekResponse });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to transcribe audio" });
    } finally {
        // Cleanup: Remove temporary file after processing
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlink(tempFilePath, (err) => {
                if (err) console.error("Error deleting temp file:", err);
                else console.log("Temporary audio file deleted successfully!");
            });
        }
    }
});

  
  

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
