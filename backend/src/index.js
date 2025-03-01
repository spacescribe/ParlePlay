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
    let tempFilePath; 
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No audio file uploaded" });
        }

        const scenario = req.body.scenario ? JSON.parse(req.body.scenario) : {title: "General conversation", description: "Start with any casual topic", userRole: "Partner 2", systemRole: "Partner 1"};
        console.log("Received scenario: ", scenario);
        console.log("Received file:", req.file.originalname);

        tempFilePath = path.join(__dirname, "temp_audio.mp3");
        fs.writeFileSync(tempFilePath, req.file.buffer);

        const transcription = await transcribeAudio(tempFilePath);
        const deepSeekResponse = await getDeepSeekResponse(transcription, scenario);

        const audioFilePath = await createAudioFileFromText(deepSeekResponse);
        console.log("Saving audio file to:", audioFilePath);

        if (!fs.existsSync(audioFilePath)) {
            throw new Error("Generated audio file not found");
        }

        console.log("Audio file successfully created at:", audioFilePath);

        res.sendFile(path.resolve(audioFilePath), (err) => {
            if (err) {
                console.error("Error sending audio file:", err);
                res.status(500).json({ error: "Failed to send audio file" });
            }
            
            setTimeout(() => {
                fs.unlinkSync(audioFilePath);
                console.log("Deleted audio file:", audioFilePath);
            }, 5000);
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to process request" });
    }
});

  
  

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
