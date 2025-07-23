const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/tts', async (req, res) => {
  const { text, voice = "nova" } = req.body;

  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice,
      input: text,
      response_format: "mp3",
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename="voice.mp3"',
    });
    res.send(buffer);
  } catch (err) {
    console.error("TTS error:", err.message);
    res.status(500).send("Error generating audio");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port 3000');
});
