// Toolbar.js
import React, { useState } from "react";
import {
  AppBar,
  Container,
  IconButton,
  Toolbar as MuiToolbar,
  Skeleton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Iron } from "@mui/icons-material";

const Toolbar = ({ isDetail, isEdit, title, onTitleChange }) => {
  const theme = useTheme();

  const handleBackClick = () => {
    window.history.back();
  };
  return (
    <AppBar
      component={"nav"}
      sx={{
        height: "65px",
        display: "flex",
        alignItems: "center",
        boxShadow: "none",
        justifyContent: "center",
      }}
    >
      {isDetail ? (
        <Container maxWidth="xl">
          <div className="flex justify-between items-center w-full">
            <IconButton onClick={handleBackClick}>
              <ArrowBackIosIcon />
            </IconButton>
            {isEdit ? (
              <input
                type="text"
                className="text-xl font-bold mx-auto bg-transparent text-center outline-none border border-gray-400 rounded-lg"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
              />
            ) : (
              <p className="text-xl font-bold mx-auto">{title}</p>
            )}
          </div>
        </Container>
      ) : (
        <Container maxWidth="xl">
          <div className="text-xl flex font-bold justify-between items-center w-full">
            memo
          </div>
        </Container>
      )}
    </AppBar>
  );
};

export default Toolbar;
