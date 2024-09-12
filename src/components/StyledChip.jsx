import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";

// StyledChip 컴포넌트 정의
const StyledChip = styled(Chip)(({ theme }) => ({
  height: 24,
  margin: "2px",
  lineHeight: "22px",
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "#faf5ff",
  border: `1px solid ${theme.palette.mode === "dark" ? "#303030" : "#e8e8e8"}`,
  borderRadius: 2,
  padding: "0 4px 0 8px",
  boxSizing: "content-box",
  outline: 0,
  overflow: "hidden",
  "&:focus": {
    borderColor: theme.palette.mode === "dark" ? "#177ddc" : "#40a9ff",
    backgroundColor: theme.palette.mode === "dark" ? "#003b57" : "#e6f7ff",
  },
  "& .MuiChip-label": {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  "& .MuiChip-deleteIcon": {
    fontSize: 16, // 삭제 아이콘 크기 설정
    cursor: "pointer",
    padding: 4,
    color: theme.palette.mode === "dark" ? "#e0e0e0" : "#333", // 삭제 아이콘 색상 설정
  },
}));

export default StyledChip;
