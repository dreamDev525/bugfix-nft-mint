import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import './App.css';
import { Home } from "./views";

import { Web3ReactProvider } from "@web3-react/core"
// import { ethers } from "ethers"
import { Web3Provider } from '@ethersproject/providers'

const getLibrary = (provider) => {
  return new Web3Provider(provider)
} 

function App() {
  return (
    // <div>
      <Web3ReactProvider getLibrary={getLibrary}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </Web3ReactProvider>
      
    // </div>
  );
}

export default App;
