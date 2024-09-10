// Toolbar.js
import React from "react";
import { AppBar, Container, Toolbar as MuiToolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Toolbar = () => {
  const theme = useTheme();

  return (
    <AppBar
      component={"nav"}
      sx={{
        height: "65px",
        backgroundColor: theme.palette.background.navbar,
        display: "flex",
        alignItems: "left",
      }}
    >
      <Container maxWidth="xl">
        <h1
          style={{
            fontFamily: "Nnum Gothic, sans-serif",
            fontSize: "2.5rem",
            fontWeight: "bold",
          }}
        >
          memo
        </h1>
      </Container>
    </AppBar>
  );
};

export default Toolbar;
