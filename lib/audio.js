const { spawn } = require("child_process");
const { PassThrough } = require("stream");

const ffmpeg = (inputBuffer, args = []) =>
  new Promise((resolve, reject) => {
    const inputStream = new PassThrough();
    const ffmpegProcess = spawn("ffmpeg", ["-y", "-i", "pipe:0", ...args, "pipe:1"]);
    const outputStream = new PassThrough();

    inputStream.pipe(ffmpegProcess.stdin);
    ffmpegProcess.stdout.pipe(outputStream);

    let data = [];
    
    outputStream.on("data", (chunk) => data.push(chunk));
    outputStream.on("end", () => resolve(Buffer.concat(data)));
    ffmpegProcess.stderr.on("data", (err) => console.error(err.toString()));

    ffmpegProcess.on("error", reject);
    ffmpegProcess.on("close", (code) => (code === 0 ? resolve(Buffer.concat(data)) : reject(new Error(`FFmpeg exited with code ${code}`))));

    inputStream.end(inputBuffer);
  });

const toAudio = async(buffer) => {
  let cc = await ffmpeg(buffer, ["-vn", "-ac", "2", "-b:a", "128k", "-ar", "44100", "-f", "mp3"]);
  return cc;
}

module.exports = { toAudio };
