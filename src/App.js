import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ComponentTest from './pages/ComponentTest';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/test' element={<ComponentTest/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
