import React, { useRef, useEffect } from "react";

const AudioVisualizer = ({ mediaStream }) => {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!mediaStream) return;

    // 오디오 컨텍스트와 분석기 노드 생성
    audioContextRef.current = new AudioContext();
    const audioContext = audioContextRef.current;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024; // FFT 크기 (분석기 정확도)
    analyserRef.current = analyser;

    const source = audioContext.createMediaStreamSource(mediaStream);
    source.connect(analyser);

    // 분석된 데이터를 저장할 배열 생성
    const bufferLength = analyser.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const canvasContext = canvas.getContext("2d");

    const drawVisualizer = () => {
      const dataArray = dataArrayRef.current;
      analyser.getByteTimeDomainData(dataArray);

      canvasContext.clearRect(0, 0, canvas.width, canvas.height);

      canvasContext.lineWidth = 2;
      canvasContext.strokeStyle = "#6b7280"; // 시각화의 색상 설정

      canvasContext.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasContext.moveTo(x, y);
        } else {
          canvasContext.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasContext.lineTo(canvas.width, canvas.height / 2);
      canvasContext.stroke();

      animationRef.current = requestAnimationFrame(drawVisualizer);
    };

    drawVisualizer();

    return () => {
      cancelAnimationFrame(animationRef.current);
      analyser.disconnect();
      audioContext.close();
    };
  }, [mediaStream]);

  return (
    <div className="flex justify-center items-center m-10 mt-20">
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="border-2 border-gray-200 rounded-lg shadow-s"
      />
    </div>
  );
};

export default AudioVisualizer;
