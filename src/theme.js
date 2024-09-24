import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#C3DDFD", // 주 색상 (primary)
    },
    secondary: {
      main: "#082f49", // 보조 색상 (secondary)
    },
    background: {
      default: "#F4EEFF", // 배경 색상
      navbar: "#76A9FA",
    },
    text: {
      primary: "#111827", // 기본 텍스트 색상
      secondary: "#555", // 보조 텍스트 색상
    },
  },
  typography: {
    fontFamily: "Noto Sans KR, Nanum Gothic", // 기본 폰트 설정
  },
});

export default theme;
