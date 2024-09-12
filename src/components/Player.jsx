import React, { useRef, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

const Player = ({ audioSrc, recordName }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="audio-player pt-6 pr-8 pl-8 pb-6 mt-6 ml-2 mr-2 mb-0">
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <div className="flex flex-col items-center mb-4">
        <p className="text-center text-lg font-semibold">{recordName}</p>
      </div>
      <input
        className="w-full"
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={(e) => {
          audioRef.current.currentTime = e.target.value;
          setCurrentTime(e.target.value);
        }}
      />
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          <span>{formatTime(currentTime)}</span>
        </div>
        <button className="px-4 py-2 rounded" onClick={handlePlayPause}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </button>
        <div className="text-sm text-gray-700">
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default Player;
