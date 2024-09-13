import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import DetailPage from "./pages/RecordDetail";
import RecordEdit from "./pages/RecordEdit";
import ComponentTest from "pages/ComponentTest";
import { ThemeProvider } from "@mui/material/styles";
import theme from "theme";
import Streaming from "pages/Streaming";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/test" element={<ComponentTest />}></Route>
          <Route path="/main" element={<Main />}></Route>
          <Route path="/details/:id" element={<DetailPage />} />
          <Route path="/edit/:id" element={<RecordEdit />} />
          <Route path="/streaming" element={<Streaming />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
