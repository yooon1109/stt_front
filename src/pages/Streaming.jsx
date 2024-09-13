import { AppBar } from "@mui/material";
import Toolbar from "components/Toolbar";
import React, { useState, useRef, useEffect } from "react";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";

const Streaming = () => {
  const [chunks, setChunks] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [transferText, setTransferText] = useState([]);
  const audioPlayerRef = useRef(null);

  const recorderControls = useVoiceVisualizer();

  const {
    // ... (Extracted controls and states, if necessary)
    recordedBlob,
    error,
    audioRef,
    isRecordingInProgress,
  } = recorderControls;

  // Get the recorded audio blob
  useEffect(() => {
    if (!recordedBlob) return;

    console.log(recordedBlob);
  }, [recordedBlob, error]);

  useEffect(() => {
    if (isRecordingInProgress) {
      startStreaming();
    }
  }, [isRecordingInProgress]);

  const startStreaming = () => {
    const eventSource = new EventSource("http://localhost:8081/api/stream");

    eventSource.onmessage = function (event) {
      setTransferText((prevText) => [...prevText, event.data]);
    };

    eventSource.onerror = function () {
      eventSource.close();
      alert("Connection closed");
    };
  };

  const startRecordings = () => {
    // navigator.mediaDevices
    //   .getDisplayMedia({ audio: true, video: true })
    //   .then((stream) => {
    //     const recorder = new MediaRecorder(stream);
    //     setMediaRecorder(recorder);
    //     recorder.ondataavailable = (event) => {
    //       if (event.data.size > 0) {
    //         setChunks((prevChunks) => [...prevChunks, event.data]);
    //       }
    //     };
    //     recorder.start();
    //   })
    //   .catch((error) => {
    //     console.error("Error accessing media devices.", error);
    //   });
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

  const startBoth = () => {
    startStreaming();
    startRecordings();
  };

  return (
    <div>
      <h1>STT Recorder</h1>
      <Toolbar />
      <div className="h-[68px]" />
      <div>
        <VoiceVisualizer controls={recorderControls} ref={audioRef} />
      </div>
      {/* 오디오 플레이어 */}
      <div id="audio-player-container">
        <audio id="audio-player" ref={audioPlayerRef}></audio>
      </div>
    </div>
  );
};

export default Streaming;
