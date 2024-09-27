import { IconButton } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import AudioRecorder from "components/AudioRecorder";
import Toolbar from "components/Toolbar";

const Recording = () => {
  return (
    <div>
      <Toolbar isDetail={true} title={"recording"} />
      <div className="h-[68px]" />
      <AudioRecorder></AudioRecorder>
      <IconButton></IconButton>
    </div>
  );
};

export default Recording;
