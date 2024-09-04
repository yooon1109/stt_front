import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import DetailPage from './pages/RecordDetail';
import RecordEdit from './pages/RecordEdit'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path='/test' element={<ComponentTest/>}></Route> */}
        <Route path='/main' element={<Main/>}></Route>
        <Route path='/details/:id' element={<DetailPage />} />
        <Route path="/edit/:id" element={<RecordEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
