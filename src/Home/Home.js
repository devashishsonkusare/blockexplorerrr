import React,{useState,useEffect}from 'react'
import "./Home.css"
import optionsData from '../Navbar/optionsData'; // Import the optionsData
import { ethers } from "ethers" 
import { Blocks } from 'react-loader-spinner';
const Home = ({ selectedOption }) => {
    const selectedOptionObject = optionsData.find(option => option.value === selectedOption);
    const selectedOptionName = selectedOptionObject ? selectedOptionObject.name : 'Unknown';
    const [blockDetails, setBlockDetails] = useState([]); // Added state for blockDetails
    const [loader, setLoader] = useState(false);

    const [blockNumber, setBlockNumber] = useState(null);
    const [gasPrice, setGasPrice] = useState(0);
    var Web3Engine;
    
    var provider;
   
    useEffect(() => {
        const connect = async () => {
            setLoader(true)
            const krypcoreWeb3SDK = require("@krypc/krypcore-web3-sdk").default;
            const Web3Engine = await krypcoreWeb3SDK.initialize({
                authorization: "bbd060cb-c12a-496a-90df-91b7080056a1",
                dappId: "DEV_DEMO_DSON_2_20230822"
            });

            const provider = new ethers.providers.JsonRpcProvider(selectedOptionObject.rpc);
            const blockNum = await provider.getBlockNumber();
            setBlockNumber(blockNum);

            const gasPrice = await provider.getGasPrice();
            const gasPriceInGwei = gasPrice / 1e9;
            setGasPrice(gasPriceInGwei);

            const blockDetailsArray = [];
            for (var i = 0; i < 10; i++) {
                const blockNo = blockNum - i;
                const cBno = "0x" + blockNo.toString(16);

                const blockData = await provider.getBlock(cBno);
                console.log("looping", i)

                blockDetailsArray.push({
                    blockNo: blockNo,
                    hash: blockData.hash,
                    transactions: blockData.transactions.length,
                    gasUsed: blockData.gasUsed.toString(),
                    timestamp: new Date(blockData.timestamp * 1000).toLocaleString()
                });
                setBlockDetails(blockDetailsArray);
                setLoader(false)

            }
            console.log("Setting block details...");
        };

        connect();
    }, [selectedOptionObject.rpc]);

    // useEffect(() => {
    //     console.log("blockDetails state:", blockDetails);


    // }, [blockDetails]);

    // connect().then(() => {
    //     setProvider().then(() => {
    //         getCurrentBlockNo();
    //         getCurrentGasPrice();
    //     })
    // })
  return (
    
      <div className="container" style={{ background: "linear-gradient(to bottom, #222, #111)" }}>
          {loader && (
              <div className="overlay">
                  <Blocks
                      visible={loader}
                      height="80"
                      width="80"
                      ariaLabel="blocks-loading"
                      wrapperStyle={{}}
                      wrapperClass="blocks-wrapper"
                  />
              </div>
          )}
  <div className="content">
    <div className='homemain' style={{color:"white", width:"50%"}}>
        <h3 style={{marginBottom:"7vh"}}>
                  Viewing Block Explorer For <span style={{ textDecoration: "underline", color:"#4FC3A1" }}>{selectedOptionName}</span>
        </h3>
        <div style={{display:"flex", backgroundColor:"transparent",gap:"20vh"}}>
                  <h4>
                      Current Block Number: {blockNumber}
                  </h4>
                  <h4>
                      Current Gas Price: {gasPrice} Gwei
                  </h4>
        </div>
          
    </div>
    <div>
        <h3 style={{textDecoration:"underline", color:"white", marginLeft:"5%"}}>Recent Blocks</h3>
              <div className="table-wrapper">
                  <table className="fl-table">
                      <thead>
                          <tr>
                              <th>Block #</th>
                              <th>Hash</th>
                              <th>Number Of Transaction</th>
                              <th>Gas Used</th>
                              <th>Timestamp</th>
                          </tr>
                      </thead>
                          <tbody>
                              {blockDetails.map((block, index) => (
                                  <tr key={index}>
                                      <td>{block.blockNo}</td>
                                      <td>{block.hash}</td>
                                      <td>{block.transactions}</td>
                                      <td>{block.gasUsed}</td>
                                      <td>{block.timestamp}</td>
                                  </tr>
                              ))}
                          </tbody>
                          </table>
                      </div>
        </div >
  </div>
    <div className="body"></div>
</div>
    
  )
}

export default Home