import React,{useEffect, useState} from 'react';
import "./Transaction.css"
import { ethers } from "ethers" 
import optionsData from '../Navbar/optionsData';
import { Blocks } from 'react-loader-spinner';
const Transaction = ({ selectedOption }) => {
    const [loader, setLoader] = useState(false);

    var defaultTransactionDetails = {
        txHash: "",
        status: "",
        blockNo: "",
        confirmations: "",
        from: "",
        to: "",
        value: "",
        gasUsed: "",
        gasLimit: ""
    };
    const [txHash, setTxHash] = useState("");
    const [transactionDetails, setTransactionDetails] = useState(defaultTransactionDetails);
    const selectedOptionObject = optionsData.find(option => option.value === selectedOption);

    const getTransactionDetails = async () => {
        setLoader(true)
        try {
            const krypcoreWeb3SDK = require("@krypc/krypcore-web3-sdk").default;
            const Web3Engine = await krypcoreWeb3SDK.initialize({
                authorization: "bbd060cb-c12a-496a-90df-91b7080056a1",
                dappId: "DEV_DEMO_DSON_2_20230822"
            });
            const provider = new ethers.providers.JsonRpcProvider(selectedOptionObject.rpc);
            const txDetails = await provider.getTransaction(txHash);
            const txReceipt = await provider.getTransactionReceipt(txHash);
            const txStatus = txReceipt.status === 1 ? "success" : "failed";

            const details = {
                txHash: txReceipt.transactionHash,
                status: txStatus,
                blockNo: txReceipt.blockNumber,
                confirmations: txReceipt.confirmations,
                from: txReceipt.from,
                to: txReceipt.to,
                value: ethers.utils.formatEther(txDetails.value),
                gasUsed: ethers.utils.formatUnits(txReceipt.gasUsed, 'gwei'),
                gasLimit: ethers.utils.formatUnits(txDetails.gasLimit, 'gwei')
            };

            setTransactionDetails(details);
        } catch (error) {
            console.error("Error fetching transaction details:", error);
            setTransactionDetails(null);
        }
        setLoader(false)
    }

    return (
        <>
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
        <div style={{ padding: '150px 100px 0px' }}>
            <h1 style={{ color: 'rgb(241, 241, 241)', textAlign: 'center', fontSize: '36px',letterSpacing:"5px" }}>Search For Transaction...</h1>
            <form>
                <div className="searchBox">

                        <input
                            className="searchInput"
                            type="text"
                            name=""
                            placeholder="Search Transactions"
                            onChange={(e) => {
                                e.preventDefault(); // Prevent unintended default behavior
                                setTxHash(e.target.value);
                            }}
                        />
                        <button
                            type="button" 
                            className="searchButton"
                            onClick={getTransactionDetails}
                        >


                            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none" style={{backgroundColor:"transparent"}}>
                                <g clipPath="url(#clip0_2_17)">
                                    <g filter="url(#filter0_d_2_17)">
                                        <path d="M23.7953 23.9182L19.0585 19.1814M19.0585 19.1814C19.8188 18.4211 20.4219 17.5185 20.8333 16.5251C21.2448 15.5318 21.4566 14.4671 21.4566 13.3919C21.4566 12.3167 21.2448 11.252 20.8333 10.2587C20.4219 9.2653 19.8188 8.36271 19.0585 7.60242C18.2982 6.84214 17.3956 6.23905 16.4022 5.82759C15.4089 5.41612 14.3442 5.20435 13.269 5.20435C12.1938 5.20435 11.1291 5.41612 10.1358 5.82759C9.1424 6.23905 8.23981 6.84214 7.47953 7.60242C5.94407 9.13789 5.08145 11.2204 5.08145 13.3919C5.08145 15.5634 5.94407 17.6459 7.47953 19.1814C9.01499 20.7168 11.0975 21.5794 13.269 21.5794C15.4405 21.5794 17.523 20.7168 19.0585 19.1814Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" shapeRendering="crispEdges"></path>
                                    </g>
                                </g>
                                <defs>
                                    <filter id="filter0_d_2_17" x="-0.418549" y="3.70435" width="29.7139" height="29.7139" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                                        <feOffset dy="4"></feOffset>
                                        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
                                        <feComposite in2="hardAlpha" operator="out"></feComposite>
                                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_17"></feBlend>
                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_17" result="shape"></feBlend>
                                    </filter>
                                    <clipPath id="clip0_2_17">
                                        <rect width="28.0702" height="28.0702" fill="white" transform="translate(0.403503 0.526367)"></rect>
                                    </clipPath>
                                </defs>
                            </svg>


                        </button>
                </div>

            </form>
           

           
        </div>
            <h3 style={{ textDecoration: "underline", color: "white", marginLeft: "5%", marginTop: "5%", letterSpacing: "5px", textUnderlineOffset: "8px" }}>Showing details of Transaction Hash</h3>
            <div className="style-0">

                <div className="style-1">
                    <div className="style-2">
                        Transaction Hash:
                    </div>
                    <div className="style-4">
                        <span className="style-5">
                            <span className="style-6">{transactionDetails.txHash}</span> </span>
                    </div>

                </div>
                {transactionDetails !== null && (
                    <div className="style-1">
                        <div className="style-2">
                            Status
                        </div>
                        <div className="style-4">
                            <span className="style-5">
                                {transactionDetails.status === "success" ? (
                                    <div className="btn success" data-btn="success">Success</div>
                                ) : (
                                    <div className="btn error" data-btn="error">Wait</div>
                                )}
                            </span>
                        </div>
                    </div>
                )}
                <div className="style-1">
                    <div className="style-2">
                        Block:
                    </div>
                    <div className="style-4">
                        <span className="style-5">
                            <span className="style-6">{transactionDetails.blockNo}</span> </span>
                    </div>

                </div>
                <div className="style-1">
                    <div className="style-2">
                        Block Confirmations:
                    </div>
                    <div className="style-4">
                        <span className="style-5">
                            <span className="style-6">{transactionDetails.confirmations}</span> </span>
                    </div>

                </div>
                <div className="style-1">
                    <div className="style-2">
                        From:
                    </div>
                    <div className="style-4">
                        <span className="style-5">
                            <span className="style-6">{transactionDetails.from}</span> </span>
                    </div>

                </div>
                <div className="style-1">
                    <div className="style-2">
                        To:
                    </div>
                    <div className="style-4">
                        <span className="style-5">
                            <span className="style-6">{transactionDetails.to}</span> </span>
                    </div>

                </div>
                <div className="style-1">
                    <div className="style-2">
                        Value:
                    </div>
                    <div className="style-4">
                        <span className="style-5">
                            <span className="style-6">{transactionDetails.value}</span> </span>
                    </div>

                </div>
                <div className="style-1">
                    <div className="style-2">
                        Gas Limit:
                    </div>
                    <div className="style-4">
                        <span className="style-5">
                            <span className="style-6">{transactionDetails.gasLimit}</span> </span>
                    </div>

                </div>
                <div className="style-1">
                    <div className="style-2">
                        Gas Used:
                    </div>
                    <div className="style-4">
                        <span className="style-5">
                            <span className="style-6">{transactionDetails.gasUsed}</span> </span>
                    </div>

                </div>

            </div>

        </>
    );
}

export default Transaction;
