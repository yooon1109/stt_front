import React, { useRef, useEffect, useState } from "react";

const AudioVisualizer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transferText, setTransferText] = useState([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  // Array to store blocks and their properties
  const blocksRef = useRef([]);
  // Timestamp for last block creation
  const lastBlockCreationRef = useRef(0);
  const blockCreationInterval = 300; // Minimum time between block creations in milliseconds

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      // 디바이스 오디오 스트림 가져오기
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
      });

      // MediaRecorder 생성 및 시작
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      const eventSource = new EventSource("http://localhost:8081/api/stream");

      eventSource.onmessage = function (event) {
        const parsedData = JSON.parse(event.data);
        const { seq, alternatives, start_at } = parsedData;
        const text = alternatives[0]?.text || "";

        setTransferText((prevText) => {
          // 동일한 seq 값이 있는지 확인
          const existingIndex = prevText.findIndex((item) => item.seq === seq);

          if (existingIndex !== -1) {
            // 동일한 seq 값을 가진 메시지가 있다면 덮어쓰기
            const updatedText = [...prevText];
            updatedText[existingIndex] = { seq, text, start_at };
            return updatedText;
          } else {
            // 새 메시지를 추가
            return [...prevText, { seq, text, start_at }];
          }
        });
      };

      eventSource.onerror = function () {
        eventSource.close();
        alert("Connection closed");
      };

      mediaRecorder.ondataavailable = (event) => {
        // 녹음 중인 오디오 데이터를 audioChunks 배열에 저장
        audioChunksRef.current.push(event.data);
        console.log(audioChunksRef);
      };

      mediaRecorder.onstop = () => {
        // 녹음이 끝난 후 오디오 데이터를 Blob으로 결합
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl); // 녹음된 오디오를 재생할 수 있도록 URL 설정
      };

      // AudioContext 생성
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      // 미디어 스트림 소스 생성
      const source = audioContext.createMediaStreamSource(stream);

      // AnalyserNode 생성
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256; // Increased FFT size for more frequency bins
      analyserRef.current = analyser;

      // 소스를 AnalyserNode에 연결
      source.connect(analyser);

      // 캔버스에 시각화 시작
      visualize();

      mediaRecorder.start();
    } catch (err) {
      console.error("Error accessing audio stream:", err);
    }
  };

  const stopRecording = () => {
    cancelAnimationFrame(animationRef.current);

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const visualize = () => {
    const canvas = canvasRef.current;
    const canvasContext = canvas.getContext("2d");
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const blockWidth = 2; // Width of each block
    const blockSpacing = 0.5; // Gap between blocks (smaller value)
    const scrollSpeed = 12; // Speed of horizontal scrolling (slower)

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);

      // Calculate average amplitude
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const averageAmplitude = sum / dataArray.length;

      // Map amplitude to block height
      const blockHeight =
        averageAmplitude > 10 ? (averageAmplitude / 255) * HEIGHT : 1;

      const now = Date.now();
      // Check if enough time has passed since the last block creation
      if (now - lastBlockCreationRef.current > blockCreationInterval) {
        blocksRef.current.push({
          x: WIDTH / 2 - blockWidth / 2, // Start position of the new block in the center
          height: blockHeight,
        });
        lastBlockCreationRef.current = now; // Update last block creation time
      }

      canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

      // Draw existing blocks
      blocksRef.current.forEach((block) => {
        const blockCenterY = HEIGHT / 2; // Center of the canvas vertically
        canvasContext.fillStyle = "#000000";

        // Draw the block above and below the center
        canvasContext.fillRect(
          block.x,
          blockCenterY - block.height / 2, // Top edge
          blockWidth,
          block.height // Full height
        );

        block.x -= (blockWidth + blockSpacing) / scrollSpeed; // Adjust for block width and spacing
      });

      // Remove blocks that have scrolled off the canvas
      blocksRef.current = blocksRef.current.filter(
        (block) => block.x + blockWidth + blockSpacing > 0
      );

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  return (
    <div>
      <button
        onClick={() => setIsRecording(!isRecording)}
        style={{ marginBottom: "10px" }}
      >
        {isRecording ? "녹음 중지" : "녹음 시작"}
      </button>

      <canvas ref={canvasRef} width="600" height="200" />
      {/* 녹음된 오디오가 있을 경우 재생 가능 */}
      {audioURL && (
        <div>
          <h3>녹음된 오디오:</h3>
          <audio ref={audioRef} controls src={audioURL}></audio>
        </div>
      )}
      <ul>
        {transferText.map((item, index) => (
          <li key={index}>
            <strong>Seq:</strong> {item.seq}, <strong>Text:</strong> {item.text}
            , <strong>Start At:</strong> {item.start_at}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AudioVisualizer;
