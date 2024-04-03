import React,{useEffect, useState} from 'react';
import "./Transaction.css"
import { ethers } from "ethers" 
import optionsData from '../Navbar/optionsData';
import { Blocks } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';



const toastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark"
};


const Transaction = ({ selectedOption }) => {
    const [loader, setLoader] = useState(false);
    const [show, setShow] = useState(false);
    const [txHash, setTxHash] = useState("");
    const [transactionDetails, setTransactionDetails] = useState(null);
    const selectedOptionObject = optionsData.find(option => option.value === selectedOption);
    const [isOpen, setIsOpen] = useState(null);
    const [search, setSearch] = useState(false);
    const { txnhash } = useParams()
    const toggleAccordion = (index) => {
        setIsOpen((prevIndex) => (prevIndex === index ? null : index));
    };

    useEffect(() => {
        setShow(false)
        setTxHash()
    }, [selectedOption]);
    useEffect(() => {
        console.log(txnhash)
        if(txnhash && !search){
            getTransactionDetails()
        }
    }, [txnhash]);

    const getTransactionDetails = async () => {
        console.log("txhaaa",txHash)
        console.log("s",search)
        let txnToFetch = txHash
        if (txnhash && !search){
            txnToFetch = txnhash 
            console.log(txnToFetch)
        }
        console.log("txjns fetch ",  txnToFetch)
        setLoader(true)
        try {
            const provider = new ethers.providers.JsonRpcProvider(selectedOptionObject.rpc);
            console.log("fetch ", txnToFetch)
            const txReceipt = await provider.getTransactionReceipt(txnToFetch);
            console.log("txReceipt", txReceipt)

            if (!txReceipt) {
                toast("Wrong Transaction Id", { ...toastOptions, mixBlendMode: "lighten" });
                setTransactionDetails(null);
                setLoader(false);
                return; 
            }

            const txDetails = await provider.getTransaction(txnToFetch);
            const block = await provider.getBlock(txReceipt.blockNumber);
            const dateFormat = new Date(block.timestamp * 1000);
            const cost = txDetails.gasPrice.mul(txReceipt.gasUsed);
            const txStatus = txReceipt.status === 1 ? "success" : "failed";
            
            const details = {
                txHash: txReceipt.transactionHash,
                status: txStatus,
                blockNo: txReceipt.blockNumber,
                blockHash: txReceipt.blockHash,
                transactionTimestamp: formatAMPM(dateFormat),
                confirmations: txReceipt.confirmations,
                from: txReceipt.from,
                to: txReceipt.to,
                value: ethers.utils.formatEther(txDetails.value),
                gasUsed: parseInt(txReceipt.gasUsed),
                gasLimit: parseInt(txDetails.gasLimit),
                transactionType: txReceipt.type,
                transactionCost: ethers.utils.formatEther(cost),
                nonceUsed: txDetails.nonce,
                position: txReceipt.transactionIndex,
                inputData: txDetails.data,
                logsData: txReceipt.logs.map(log => ({
                    address: log.address,
                    topics: log.topics,
                    data: log.data,
                    logIndex: log.logIndex
                }))
            };
            setShow(true);
            setTransactionDetails(details);
        } catch (error) {
            console.error("Error fetching transaction details:", error);
            toast("Error fetching transaction details", { ...toastOptions, mixBlendMode: "lighten" });
            setTransactionDetails(null);
        }
        setLoader(false);
    }

    // Func to change the format of the date
    function formatAMPM(dateObj) {
        const isoString = dateObj.toISOString();
        const year = isoString.slice(0, 4);
        const month = isoString.slice(5, 7);
        const day = isoString.slice(8, 10);
        const time = isoString.slice(11, 19);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthStr = months[parseInt(month, 10) - 1];
        const hour = parseInt(time.slice(0, 2), 10);
        const hour12 = hour > 12 ? hour - 12 : hour;
        const amPm = hour >= 12 ? "PM" : "AM";
        const time12h = `${String(hour12).padStart(2, '0')}${time.slice(2, 8)} ${amPm}`;
        return `${monthStr}-${day}-${year} ${time12h} +UTC`;
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
            <h1 style={{ color: 'rgb(241, 241, 241)', textAlign: 'center', fontSize: '36px',letterSpacing:"5px" }}>Search For Transaction Hash</h1>
            <form>
                <div className="searchBox">

                        <input
                            className="searchInput"
                            type="text"
                            name=""
                            placeholder="Search Transactions"
                            onChange={(e) => {
                                e.preventDefault(); // Prevent unintended default behavior
                                setTxHash(e.target.value.trim());
                                setSearch(true)
                                window.history.pushState({}, document.title, '/search-transaction');

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
            {show  && <div>
            <h3 style={{ textDecoration: "underline", color: "white", marginLeft: "5%", marginTop: "5%", letterSpacing: "5px", textUnderlineOffset: "8px" }}>Showing details of Transaction Hash</h3>
            {transactionDetails && <div className="style-0">

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
                                    <div className="btn error" data-btn="error">Failure</div>
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
                            Block Hash:
                        </div>
                        <div className="style-4">
                            <span className="style-5">
                                <span className="style-6">{transactionDetails.blockHash}</span> </span>
                        </div>

                    </div>
                    <div className="style-1">
                        <div className="style-2">
                            Transaction Timestamp :
                        </div>
                        <div className="style-4">
                            <span className="style-5">
                                <span className="style-6">{transactionDetails.transactionTimestamp}</span> </span>
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
                    <div className="style-1">
                        <div className="style-2">
                            Transaction Type:
                        </div>
                        <div className="style-4">
                            <span className="style-5">
                                <span className="style-6">{transactionDetails.transactionType}</span> </span>
                        </div>

                    </div>
                    <div className="style-1">
                        <div className="style-2">
                            Transaction Cost (in ether):
                        </div>
                        <div className="style-4">
                            <span className="style-5">
                                <span className="style-6">{transactionDetails.transactionCost}</span> </span>
                        </div>

                    </div>
                    <div className="style-1">
                        <div className="style-2">
                            Nonce Used:
                        </div>
                        <div className="style-4">
                            <span className="style-5">
                                <span className="style-6">{transactionDetails.nonceUsed}</span> </span>
                        </div>

                    </div>
                    <div className="style-1">
                        <div className="style-2">
                            Position in transaction Index:
                        </div>
                        <div className="style-4">
                            <span className="style-5">
                                <span className="style-6">{transactionDetails.position}</span> </span>
                        </div>

                    </div>
                    <div className="style-1">
                        <div className="style-2">
                            Input Data:
                        </div>
                        <div className="style-4">
                            <textarea
                                readOnly
                                spellCheck="false"
                                className="form-control bg-light text-secondary text-monospace p-3"
                                rows="4"
                                id="inputdata"
                                value={transactionDetails.inputData}
                                style={{width:"100%",color:"white"}}
                            ></textarea>                                
                        </div>

                    </div>
                    <div className="style-1">
                        <div className="style-2">
                            Logs Data:
                        </div>
                        <div className="style-4">
                            {transactionDetails.logsData.map((log, index) => (
                                <div key={index} className="accordion">
                                    <div className="accordion-header" onClick={() => toggleAccordion(index)}>
                                        <div>Log {index + 1}</div>
                                    </div>
                                    {isOpen === index && (
                                        <div className="accordion-content">
                                            <div>Address: {log.address}</div>
                                            <div>Topics: {log.topics.join(', ')}</div>
                                            <div>Data: {log.data}</div>
                                            <div>Log Index: {log.logIndex}</div>
                                        </div>
                                    )}
                                </div>
                            ))}


                        </div>
                    </div>
                


            </div>}
        </div>}

            <ToastContainer style={{backgroundColor:"transparent"}}/>
        </>
    );
}

export default Transaction;
