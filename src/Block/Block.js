import React, { useEffect, useState } from 'react';
import "./Block.css"
import { ethers } from "ethers"
import optionsData from '../Navbar/optionsData';
import { Blocks } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
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
    const [block, setBlock] = useState("");
    const [blockDetails, setBlockDetails] = useState(null);
    const selectedOptionObject = optionsData.find(option => option.value === selectedOption);
    const [isOpen, setIsOpen] = useState(null);

    // Function to toggle accordion
    const toggleAccordion = (index) => {
        setIsOpen((prevIndex) => (prevIndex === index ? null : index));
    };
    useEffect(() => {
        setShow(false)
        setBlock()
    }, [selectedOption]);
    const getTransactionDetails = async () => {
        console.log(block)
        setLoader(true);
        try {
            if (!block) {
                toast("Block is required", { ...toastOptions });
                return;
            }

            const provider = new ethers.providers.JsonRpcProvider(selectedOptionObject.rpc);
            const blockData = await provider.getBlock(block);

            if (!blockData) {
                toast("Wrong Transaction Id", { ...toastOptions });
                setBlockDetails(null);
            } else {

                const listOfTransactionHash = blockData.transactions.join('\n');
                const baseFeePerGasWei = blockData.baseFeePerGas.toString();
                const dateFormat = new Date(blockData.timestamp * 1000);
                const details = {
                    blockHeight: blockData.number,
                    blockHash: blockData.hash,
                    parentHash: blockData.parentHash,
                    timestamp: formatAMPM(dateFormat), // Update the timestamp field
                    gasLimit: blockData.gasLimit.toString(),
                    gasUsed: blockData.gasUsed.toString(),
                    noOfTransactions: blockData.transactions.length,
                    listOfTransactionHash,
                    difficulty: blockData.difficulty,
                    baseFeePerGas: `${baseFeePerGasWei} wei`,
                };
                setShow(true);
                setBlockDetails(details);
            }
        } catch (error) {
            console.error("Error fetching transaction details:", error);
            toast("Error fetching transaction details", { ...toastOptions, mixBlendMode: "lighten" });
            setBlockDetails(null);
        } finally {
            setLoader(false);
        }
    };
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
    const handleInputChange = (e) => {
        e.preventDefault();
        console.log(e.target.value)
        const value = e.target.value;

        // Check if the input is a valid hexadecimal block hash (starts with '0x')
        if (/^0x[a-fA-F0-9]+$/.test(value)) {
            setBlock(value);
        }
        // Check if the input is a valid numeric block number
        else if (!isNaN(value) && parseInt(value) == value) {
            console.log(value)
            const numericValue = parseInt(value);
            console.log(numericValue);

            setBlock(numericValue);
        } else {
            // Handle the case where the input is neither a valid block number nor a block hash
            console.log("Invalid input: not a valid block number or block hash");
            // You can also show an error message to the user here
        }
    };



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
                <h1 style={{ color: 'rgb(241, 241, 241)', textAlign: 'center', fontSize: '36px', letterSpacing: "5px" }}>Search For Block by Block Number or Block Hash</h1>
                <form>
                    <div className="searchBox">

                        <input
                            className="searchInput"
                            type="text"
                            name=""
                            placeholder="Search Block"
                            onChange={handleInputChange}

                        />
                        <button
                            type="button"
                            className="searchButton"
                            onClick={getTransactionDetails}
                        >


                            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none" style={{ backgroundColor: "transparent" }}>
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
            {show && <div>
                <h3 style={{ textDecoration: "underline", color: "white", marginLeft: "5%", marginTop: "5%", letterSpacing: "5px", textUnderlineOffset: "8px" }}>Showing details of Block</h3>
                <div className="style-0">

                    <div className="style-1">
                        <div className="style-2">
                            Block Height:
                        </div>
                        <div className="style-4">
                            <span className="style-5">
                                <span className="style-6">{blockDetails.blockHeight}</span> </span>
                        </div>

                    </div>
                    <div className="style-1">
                        <div className="style-2">
                            Block Hash:
                        </div>
                        <div className="style-4">
                            <span className="style-5">
                                <span className="style-6">{blockDetails.blockHash}</span> </span>
                        </div>

                    </div>
                    <div className="style-1">
                        <div className="style-2">
                            Parent Hash:
                        </div>
                        <div className="style-4">
                            <span className="style-5">
                                <span className="style-6">{blockDetails.parentHash}</span> </span>
                        </div>

                    </div>
                    <div className="style-1">
                        <div className="style-2">
                            Timestamp:
                        </div>
                        <div className="style-4">
                            <span className="style-5">
                                <span className="style-6">{blockDetails.timestamp}</span> </span>
                        </div>

                    </div>
                    <div className="style-1">
                        <div className="style-2">
                            Gas Limit:
                        </div>
                        <div className="style-4">
                            <span className="style-5">
                                <span className="style-6">{blockDetails.gasLimit}</span> </span>
                        </div>

                    </div>
                    <div className="style-1">
                        <div className="style-2">
                            Gas Used:
                        </div>
                        <div className="style-4">
                            <span className="style-5">
                                <span className="style-6">{blockDetails.gasUsed}</span> </span>
                        </div>

                    </div>
                    <div className="style-1">
                        <div className="style-2">
                            No of transactions:
                        </div>
                        <div className="style-4">
                            <span className="style-5">
                                <span className="style-6">{blockDetails.noOfTransactions}</span> </span>
                        </div>

                    </div>

                    <div className="style-1">
                        <div className="style-2">
                            List Of Transaction Hash:
                        </div>
                        <div className="style-4" style={{ color: "white" }}>
                            <div className="accordion">
                                <div className="accordion-header" onClick={toggleAccordion}>
                                    Show transactions
                                </div>
                                {isOpen && (
                                    <div className="accordion-content">
                                        <ul className="transaction-list">
                                            {blockDetails.listOfTransactionHash.split('\n').map((txHash, index) => (
                                                <li key={index} className="transaction-item">
                                                    <span className="style-5">
                                                        <span className="style-6">{txHash}</span>
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>


                    </div>
                    <div className="style-1">
                        <div className="style-2">
                            Difficulty:
                        </div>
                        <div className="style-4">
                            <span className="style-5">
                                <span className="style-6">{blockDetails.difficulty}</span> </span>
                        </div>

                    </div>
                    <div className="style-1">
                        <div className="style-2">
                            Base Fee Per Gas:
                        </div>
                        <div className="style-4">
                            <span className="style-5">
                                <span className="style-6">{blockDetails.baseFeePerGas}</span> </span>
                        </div>

                    </div>

                </div>
            </div>}

            <ToastContainer style={{ backgroundColor: "transparent" }} />
        </>
    );
}

export default Transaction;
