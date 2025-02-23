import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Practise from './pages/Practise';
import './styles.css'

function App(){
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/practise' element={<Practise />} />
      </Routes>
    </Router>
  )
}

export default App;