"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transcribeAudio = transcribeAudio;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const assemblyai_1 = require("assemblyai");
dotenv_1.default.config();
const ASSEMBLYAI_API = process.env.ASSEMBLYAI_API_KEY;
if (!ASSEMBLYAI_API)
    throw new Error("API key not found");
const client = new assemblyai_1.AssemblyAI({ apiKey: ASSEMBLYAI_API });
/**
 * Uploads the audio file to AssemblyAI.
 * @param filePath The file path to the audio file.
 * @returns The audio file URL.
 */
function uploadFiles(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_1.default.existsSync(filePath)) {
            throw new Error("Audio file doesn't exist in the given path");
        }
        const fileBuffer = fs_1.default.readFileSync(filePath);
        const audioUrl = yield client.files.upload(fileBuffer);
        return audioUrl;
    });
}
/**
 * Transcribes the audio file and returns the transcription text.
 * @param filePath The file path to the audio file.
 * @returns The transcription text.
 */
function transcribeAudio(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const audioUrl = yield uploadFiles(filePath);
            console.log("Audio uploaded");
            const params = {
                audio: audioUrl,
                speaker_labels: true,
                language_code: 'fr'
            };
            while (true) {
                const transcript = yield client.transcripts.transcribe(params);
                if (transcript.status === "completed") {
                    return (_a = transcript.text) !== null && _a !== void 0 ? _a : "";
                }
            }
        }
        catch (error) {
            console.error("Error in transcription:", error);
            throw error;
        }
    });
}
