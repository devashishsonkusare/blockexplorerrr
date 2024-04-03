import './App.css';
import Navbar from './Navbar/Navbar';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home/Home';
import Transaction from './Transaction/Transaction';
import Address from './Address/Address';
import optionsData from './Navbar/optionsData';
import Block from "./Block/Block"
function App() {

  const [selectedOption, setSelectedOption] = useState(optionsData[0].value); // Set initial value
  return (
    <Router>
      <Navbar setSelectedOption={setSelectedOption} />
      <Routes>
        <Route exact path="/" element={<Home selectedOption={selectedOption} />} />
        <Route exact path="/search-block/:blockHash" element={<Block selectedOption={selectedOption} />} />
        <Route exact path="/search-block" element={<Block selectedOption={selectedOption} />} />
        <Route exact path="/search-transaction" element={<Transaction selectedOption={selectedOption} />} />
        <Route exact path="/search-transaction/:txnhash" element={<Transaction selectedOption={selectedOption} />} />
        <Route exact path="/search-address" element={<Address selectedOption={selectedOption} />} />
        
      </Routes>
    </Router>
  );
}

export default App;
