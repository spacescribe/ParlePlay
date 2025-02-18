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
Object.defineProperty(exports, "__esModule", { value: true });
const assemblyai_1 = require("assemblyai");
const client = new assemblyai_1.AssemblyAI({
    apiKey: "f1f686b8d58845f5a693ae1c27776377"
});
// You can use a local filepath:
// const audioFile = "./example.mp3"
// Or use a publicly-accessible URL:
// const audioFile = 'https://assembly.ai/sports_injuries.mp3'
const audioFile = 'heheh.mp3';
const params = {
    audio: audioFile,
    speaker_labels: true
};
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    const transcript = yield client.transcripts.transcribe(params);
    if (transcript.status === 'error') {
        console.error(`Transcription failed: ${transcript.error}`);
        process.exit(1);
    }
    console.log(transcript.text);
    for (let utterance of transcript.utterances) {
        console.log(`Speaker ${utterance.speaker}: ${utterance.text}`);
    }
});
run();
