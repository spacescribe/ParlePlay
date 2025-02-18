import { AssemblyAI } from 'assemblyai'

const client = new AssemblyAI({
  apiKey: "f1f686b8d58845f5a693ae1c27776377"
})

// You can use a local filepath:
// const audioFile = "./example.mp3"

// Or use a publicly-accessible URL:
// const audioFile = 'https://assembly.ai/sports_injuries.mp3'
const audioFile='heheh.mp3'

const params = {
  audio: audioFile,
  speaker_labels: true
}

const run = async () => {
  const transcript = await client.transcripts.transcribe(params)

  if (transcript.status === 'error') {
    console.error(`Transcription failed: ${transcript.error}`)
    process.exit(1)
  }

  console.log(transcript.text)

  for (let utterance of transcript.utterances!) {
    console.log(`Speaker ${utterance.speaker}: ${utterance.text}`)
  }
}

run()
