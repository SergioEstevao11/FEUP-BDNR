import './App.css';
// import Alert from 'react-bootstrap/Alert';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from './pages/homepage';
import RoyalPage from './pages/royalpage';
import ConflictPage from './pages/conflictpage';

function App() {

  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/royal/:id" element={<RoyalPage/>} />
        <Route path="/conflict/:id" element={<ConflictPage/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
