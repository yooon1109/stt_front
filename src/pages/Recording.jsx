import React, { useState, useRef, useEffect } from "react";

const Recording = () => {
  const mediaRecorderRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    // MediaRecorder 생성 및 시작
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = async (event) => {
      // 녹음 중인 오디오 데이터를 audioChunks 배열에 저장
      // const arrayBuffer = await event.data.arrayBuffer()
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.start();

    // Stop recording and clean up
    mediaRecorder.onstop = async () => {
      // 녹음이 끝난 후 모든 녹음된 오디오 데이터를 Blob으로 결합
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl); // Blob URL을 상태에 저장
      stream.getTracks().forEach((track) => track.stop());
    };
  };

  return (
    <div>
      {audioUrl && (
        <div>
          <h2>Recorded Audio:</h2>
          <audio controls src={audioUrl} />
        </div>
      )}
    </div>
  );
};

export default Recording;
