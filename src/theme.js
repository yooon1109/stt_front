import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#BED7DC", // 주 색상 (primary)
    },
    secondary: {
      main: "#a855f7", // 보조 색상 (secondary)
    },
    background: {
      default: "#F4EEFF", // 배경 색상
      navbar: "#BED7DC",
    },
    text: {
      primary: "#1B262C", // 기본 텍스트 색상
      secondary: "#555", // 보조 텍스트 색상
    },
  },
  typography: {
    fontFamily: "Noto Sans KR, Nanum Gothic", // 기본 폰트 설정
  },
});

export default theme;
