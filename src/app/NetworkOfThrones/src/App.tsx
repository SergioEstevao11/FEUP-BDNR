import './App.css';
// import Alert from 'react-bootstrap/Alert';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from './pages/homepage';
import RoyalPage from './pages/royalpage';

function App() {


  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/searchresults/" element={<RoyalPage/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
