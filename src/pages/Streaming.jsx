import { AppBar } from "@mui/material";
import Toolbar from "components/Toolbar";
import React, { useState, useRef, useEffect } from "react";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";

const Streaming = () => {
  const BUFFER_SIZE = 1024; // 설정할 버퍼 크기

  const [chunks, setChunks] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [transferText, setTransferText] = useState([]);
  const audioPlayerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const getToken = async () => {
      // try {
      //   const response = await fetch("http://localhost:8081/api/token", {
      //     method: "GET",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   });
      //   const token = await response.text();
      // } catch (error) {
      //   console.log(error.message);
      // }
    };

    getToken();
  }, []);

  const handleStartRecording = () => {
    console.log("Recording started!");
    startStreaming(); // Call your specific function here
  };

  const handleStopRecording = () => {
    console.log("Recording stop");
    stopRecording();
  };

  const startStreaming = async () => {
    const wsUrl = "ws://localhost:8081/api/audio";
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    const stream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
    });

    const mediaRecorder = new MediaRecorder(stream);
    const BUFFER_SIZE = 4096; // 이 값을 원하는 크기로 조정합니다.

    mediaRecorder.ondataavailable = (event) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        let data = new Uint8Array(e.target.result);
        while (data.length > BUFFER_SIZE) {
          const chunk = data.slice(0, BUFFER_SIZE);
          socket.send(chunk);
          data = data.slice(BUFFER_SIZE);
        }
        if (data.length > 0) {
          socket.send(data);
        }
      };
      reader.readAsArrayBuffer(event.data);
    };

    mediaRecorder.onstop = () => {
      console.log("MediaRecorder stopped");
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };

    mediaRecorder.start();
  };
  const gettranslate = () => {
    const eventSource = new EventSource("http://localhost:8081/api/stream");

    eventSource.onmessage = function (event) {
      setTransferText((prevText) => [...prevText, event.data]);
    };

    eventSource.onerror = function () {
      eventSource.close();
      alert("Connection closed");
    };
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());

      // Send stop signal to the server
      fetch("http://localhost:8081/api/stop", {
        method: "POST",
      })
        .then(() => {
          console.log("Recording stopped on server");
        })
        .catch((error) => {
          console.error("Error stopping recording:", error);
        });

      mediaRecorder.onstop = () => {
        // 녹음이 완전히 종료된 후 Blob 생성
        const blob = new Blob(chunks, { type: "audio/webm" });
        const newAudioURL = window.URL.createObjectURL(blob);
        setAudioURL(newAudioURL);

        // 오디오 태그에 녹음된 파일을 연결
        if (audioPlayerRef.current) {
          audioPlayerRef.current.src = newAudioURL; // ref를 통해 src 업데이트
          audioPlayerRef.current.controls = true; // 오디오 컨트롤 활성화
        }
      };
    }
  };

  useEffect(() => {
    // Update VoiceVisualizer's audioRef src if audioURL is updated
    console.log(audioURL);
    if (audioURL && audioPlayerRef.current) {
      audioPlayerRef.current.src = audioURL;
    }
  }, [audioURL]);

  return (
    <div>
      <h1>STT Recorder</h1>
      <Toolbar />
      <div className="h-[68px]" />
      <div>
        <button onClick={handleStartRecording}>녹음시작</button>
      </div>
      {/* 오디오 플레이어 */}
      <div id="audio-player-container">
        <audio id="audio-player" ref={audioPlayerRef}></audio>
      </div>
    </div>
  );
};

export default Streaming;
