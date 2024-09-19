import React, { useRef, useEffect, useState } from "react";
import { stopStreaming } from "apis/StreamApi";
import Canvas from "./Canvas";

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
      const stream = await navigator.mediaDevices.getUserMedia({
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

      mediaRecorder.ondataavailable = async (event) => {
        // 녹음 중인 오디오 데이터를 audioChunks 배열에 저장
        audioChunksRef.current.push(event.data);
        console.log(audioChunksRef);
      };

      mediaRecorder.onstop = async () => {
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

      mediaRecorder.start();
    } catch (err) {
      console.error("Error accessing audio stream:", err);
    }
  };

  const stopRecording = () => {
    cancelAnimationFrame(animationRef.current);
    stopStreaming();

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsRecording(!isRecording)}
        style={{ marginBottom: "10px" }}
      >
        {isRecording ? "녹음 중지" : "녹음 시작"}
      </button>
      <Canvas analyserRef={analyserRef} />
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
