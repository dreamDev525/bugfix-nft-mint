import React, { useEffect, useRef, useState } from "react"
import bannerImg from "../assets/images/heroIllustration.svg"
// import ethLogo from "../assets/images/bidifylogo.png"
// import maticLogo from "../assets/images/bidifylogo_matic.png"
import avaxLogo from "../assets/images/bidifylogo_avax.png"
// import egemLogo from "../assets/images/bidifylogo_egem.png"
import disturb from "../assets/images/disturb.png"
import preview from "../assets/images/preview.svg"
import mintLogo from "../assets/images/mintlogo.jpg"

import { useWeb3React } from "@web3-react/core"
import { FetchWrapper } from "use-nft";
import { injected } from "../connectors"
import { switchNetwork } from "../wallet"
import { addresses, ABI, NETWORKS, supportedChainIds, TOKEN_DECIMALS, TOKEN_SYMBOL, explorer, BIDIFY, getLogUrl, snowApi, baseUrl } from "../constants"
import { ethers, Contract } from "ethers"
import { Buffer } from "buffer"
import axios from "axios"

import { create } from 'ipfs-http-client'
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
const modalContents = {
    ipfs: "Uploading data to the IPFS...",
    mint: "Minting NFTs...",
    list: "Creating Auctions..."
}

export const Home = () => {
    const { account, library, chainId, activate } = useWeb3React()
    const [buffer, setBuffer] = useState()
    const [name, setName] = useState()
    const [description, setDescription] = useState()
    const [amount, setAmount] = useState(1)
    const [forSale, setForSale] = useState(false)
    const [bid, setBid] = useState()
    const [duration, setDuration] = useState()
    const [type, setType] = useState()
    const [loading, setLoading] = useState(false)
    const [approving, setApproving] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [transaction, setTransaction] = useState("")
    const [approved, setApproved] = useState(false)
    const [modalContent, setModalContent] = useState("")

    const [open, setOpen] = useState(false);
    const drop = useRef("network");
    const handleClick = (e) => {
        if (!drop.current) return
        if (!e.target.closest(`#${drop.current.id}`) && open) {
            setOpen(false);
        }
    }
    useEffect(() => {
        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick);
        };
    });
    const handleConnect = async () => {
        if (account) return
        try {
            await activate(injected, async (error) => {
                console.log(error.message)
            })
        } catch (e) {
            console.log(e.message)
        }
    }
    const handleSwitchNetwork = async (id) => {
        setOpen(false)
        await switchNetwork(Number(id))
    }
    useEffect(() => {
        handleConnect()
    }, [])
    useEffect(() => {
        if (library) checkAllowd()
    }, [library])
    const getLogo = () => {
        return mintLogo
        // if(chainId === undefined) return ethLogo
        // switch (chainId) {
        //     case 1: case 4:
        //         return ethLogo
        //     case 1987:
        //         return egemLogo
        //     case 137: case 80001:
        //         return maticLogo
        //     case 43113: case 43114:
        //         return avaxLogo
        //     default: return ethLogo
        // }
    }
    const getSymbol = () => {
        // if(chainId === undefined) return ethLogo
        switch (chainId) {
            case 1: case 4:
                return "ETH"
            case 1987:
                return "EGEM"
            case 137: case 80001:
                return "MATIC"
            case 43113: case 43114:
                // return avaxLogo
                return "AVAX"
            default: return "Currency"
        }
    }
    const readImage = event => {
        event.preventDefault()
        const file = event.target.files[0]
        // console.log(file)
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            setType(file.type);
            setBuffer(Buffer(reader.result));
        }
    }
    const getLogs = async () => {
        // const web3 = new Web3(new Web3.providers.HttpProvider(URLS[chainId]));
        const topic0 =
            "0xb8160cd5a5d5f01ed9352faa7324b9df403f9c15c1ed9ba8cb8ee8ddbd50b748";
        let logs = [];
        try {
            const ret = await axios.get(`${getLogUrl[chainId]}&fromBlock=0&toBlock=latest&address=${BIDIFY.address[chainId]}&topic0=${topic0}&apikey=${snowApi[chainId]}`)
            logs = ret.data.result
            // console.log(ret)
        } catch (e) {
            console.log(e.message)
        }
        return logs ? logs.length : 0;
    };
    const checkAllowd = async () => {
        const BidifyToken = new ethers.Contract(addresses[chainId], ABI, library.getSigner())
        const allowed = await BidifyToken.isApprovedForAll(account, BIDIFY.address[chainId])
        setApproved(allowed)
    }
    const signList = async () => {
        setApproving(true)
        try{
            const BidifyToken = new ethers.Contract(addresses[chainId], ABI, library.getSigner())
            await BidifyToken.setApprovalForAll(BIDIFY.address[chainId], true)
            await checkAllowd()
            setApproving(false)
        } catch (e) {
            setApproving(false)
            console.log(e.message)
        }
        
    }
    const list = async (token, price, days) => {
        const currency = "0x0000000000000000000000000000000000000000";
        const platform = addresses[chainId];
        const Bidify = new ethers.Contract(
            BIDIFY.address[chainId],
            BIDIFY.abi,
            library.getSigner()
        );
        try {
            const totalCount = await getLogs()
            const tx = await Bidify
                .list(
                    currency,
                    platform,
                    token,
                    ethers.utils.parseEther(price.toString()).toString(),
                    days,
                    "0x0000000000000000000000000000000000000000",
                    false,
                    true,
                )
            const det = await tx.wait()
            while (await getLogs() === totalCount) {
                console.log("while loop")
            }
            // console.log("listed results", tx, det)
            // const listCnt = await getLogs()
            // console.log("total Count")
            const newId = totalCount
            const listingDetail = await getDetailFromId(newId)
            console.log("adding to database", listingDetail)
            await axios.post(`${baseUrl}/auctions`, listingDetail)
        } catch (error) {
            return console.log("list error", error)
        }
    }
    const getDetailFromId = async (id) => {
        const detail = await getListingDetail(id)
        const fetchedValue = await getFetchValues(detail)
        return { ...fetchedValue, ...detail, network: chainId }

    }
    const getListingDetail = async (id) => {
        const bidify = new ethers.Contract(BIDIFY.address[chainId], BIDIFY.abi, library.getSigner())
        const raw = await bidify.getListing(id.toString())
        const nullIfZeroAddress = (value) => {
            if (value === "0x0000000000000000000000000000000000000000") {
                return null;
            }
            return value;
        };

        let currency = nullIfZeroAddress(raw.currency);
        let highBidder = nullIfZeroAddress(raw.highBidder);
        let currentBid = raw.price;
        let nextBid = await bidify.getNextBid(id);
        let decimals = 18;
        if (currentBid === nextBid) {
            currentBid = null;
        } else {
            currentBid = ethers.utils.formatEther(currentBid);
        }

        let referrer = nullIfZeroAddress(raw.referrer);
        let marketplace = nullIfZeroAddress(raw.marketplace);

        let bids = [];
        const topic1 = "0x" + id.toString(16).padStart(64, "0");
        const ret = await axios.get(`${getLogUrl[chainId]}&fromBlock=0&toBlock=latest&topic0=0xdbf5dea084c6b3ed344cc0976b2643f2c9a3400350e04162ea3f7302c16ee914&topic0_1_opr=and&topic1=${topic1}&apikey=${snowApi[chainId]}`)
        const logs = ret.data.result
        for (let bid of logs) {
            bids.push({
                bidder: "0x" + bid.topics[2].substr(-40),
                price: ethers.utils.formatEther(ethers.BigNumber.from(bid.data)),
            });
        }
        return {
            id,
            creator: raw.creator,
            currency,
            platform: raw.platform,
            token: raw.token.toString(),

            highBidder,
            currentBid,
            nextBid: ethers.utils.formatEther(nextBid),

            referrer,
            allowMarketplace: raw.allowMarketplace,
            marketplace,

            endTime: raw.endTime.toString(),
            paidOut: raw.paidOut,
            isERC721: raw.isERC721,

            bids,
        };
    }
    const getFetchValues = async (val) => {
        let provider;
        switch (chainId) {
            case 1:
                provider = new ethers.providers.InfuraProvider(
                    "mainnet",
                    "0c8149f8e63b4b818d441dd7f74ab618"
                );
                break;
            case 3:
                provider = new ethers.providers.InfuraProvider(
                    "ropsten",
                    "0c8149f8e63b4b818d441dd7f74ab618"
                );
                break;
            case 4:
                provider = new ethers.providers.InfuraProvider(
                    "rinkeby",
                    "0c8149f8e63b4b818d441dd7f74ab618"
                );
                break;
            case 5:
                provider = new ethers.providers.InfuraProvider(
                    "goerli",
                    "0c8149f8e63b4b818d441dd7f74ab618"
                );
                break;
            case 42:
                provider = new ethers.providers.InfuraProvider(
                    "kovan",
                    "0c8149f8e63b4b818d441dd7f74ab618"
                );
                break;
            case 1987:
                provider = new ethers.providers.JsonRpcProvider("https://lb.rpc.egem.io")
                break;
            case 43113:
                provider = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc")
                break;
            case 43114:
                provider = new ethers.providers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc")
                break;
            case 80001:
                provider = new ethers.providers.JsonRpcProvider("https://matic-testnet-archive-rpc.bwarelabs.com")
                break;
            case 137:
                provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com")
                break;
            default:
                console.log("select valid chain");
        }

        const ethersConfig = {
            ethers: { Contract },
            provider: provider,
        };


        const fetcher = ["ethers", ethersConfig];

        function ipfsUrl(cid, path = "") {
            return `https://dweb.link/ipfs/${cid}${path}`;
        }

        function imageurl(url) {
            const string = url;
            const check = url.substr(16, 4);
            if (check === "ipfs") {
                const manipulated = url.substr(16, 16 + 45);
                return "https://dweb.link/" + manipulated;
            } else {
                return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
            }
        }

        // function jsonurl(url) {
        //   return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        // }

        const fetchWrapper = new FetchWrapper(fetcher, {
            jsonProxy: (url) => {
                return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
            },
            imageProxy: (url) => {
                return imageurl(url);
            },
            ipfsUrl: (cid, path) => {
                return ipfsUrl(cid, path);
            },
        });
        const result = await fetchWrapper.fetchNft(val?.platform, val?.token);
        const finalResult = {
            ...result,
            platform: val?.platform,
            token: val?.token,
            isERC721: result.owner ? true : false,
        };
        return finalResult;
    };

    const onSubmit = async () => {
        // if (buffer === undefined || name === undefined || description === undefined) return console.log("please insert all values")
        // if (amount < 1) return console.log("Invalid amount")

        setLoading(true)
        // const tokenURIJson = "https://ipfs.io/ipfs/QmRhiLoSbqeNz2UrAJiyuBk9XcSyqRhGc3qG5j6X5g9ZdW"
        setModalContent("ipfs")
        ipfs.add(buffer).then(async (result) => {
            const tokenURI = {
                name,
                description,
                image: `https://ipfs.io/ipfs/${result.path}`
            }
            const added = await ipfs.add(Buffer(JSON.stringify(tokenURI)))
            const tokenURIJson = `https://ipfs.io/ipfs/${added.path}`
            console.log(tokenURIJson)
            setModalContent("mint")
            const signer = library.getSigner()
            const BidifyMinter = new ethers.Contract(addresses[chainId], ABI, signer)
            // return console.log(myBalance)
            const mintCost = await BidifyMinter.calculateCost(amount)
            console.log(mintCost.toString())
            const tx = await BidifyMinter.multipleMint(tokenURIJson.toString(), amount, { value: mintCost })
            const txHash = await tx.wait()
            // await signList()
            setTransaction(txHash.transactionHash)
            if (forSale) {
                const tokenIds = txHash.events.map((event) => {
                    return event.args.tokenId
                })
                setModalContent("list")
                try {
                    for (let i = 0; i < tokenIds.length; i++) {
                        await list(tokenIds[i].toString(), bid, duration)
                        console.log("listed Id", tokenIds[i].toString())
                    }
                    console.log("listed counts", tokenIds)
                } catch (e) {
                    console.log("listing error", e)
                }
            }
            setShowAlert(true)
            setLoading(false);
            if (type === '') {
                setType('none');
            }
        }).catch(err => {
            console.log("err", err)
            setLoading(false);
        })
    }
    return (
        <div>
            <div className="flex justify-between py-1 px-4 items-center shadow-xl">
                <img className="max-h-[40px] sm:max-h-[75px]" src={getLogo()} alt="logo" />
                <div className="flex my-0 sm:my-3 gap-0 sm:gap-4">
                    <div className="flex" ref={drop} id="network">
                        {account && <button onClick={() => setOpen(open => !open)} id="dropdownButton" className="text-gray-700 bg-gray-300 hover:bg-gray-200 focus:ring-[#f7b541] font-medium rounded-full text-sm mx-1 sm:pr-2 p-1 sm:pr-4 text-center inline-flex items-center dark:bg-[#f7a531] dark:hover:bg-[#f7b541] dark:focus:ring-[#f7b541]" type="button"><img className="max-h-[30px] mr-0 sm:mr-2" src={supportedChainIds.includes(chainId) ? NETWORKS[chainId].image : disturb} alt="unsupported" /><p className="hidden sm:block">{supportedChainIds.includes(chainId) ? NETWORKS[chainId].label : "Unsupported chain"}</p></button>}

                        {/* <!-- Dropdown menu --> */}
                        {open && <div className="z-10 mr-2 text-base list-none bg-white absolute top-[65px] rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
                            <ul className="py-1" aria-labelledby="dropdownButton">
                                {Object.keys(NETWORKS).map((networkId) => {
                                    const network = NETWORKS[networkId]
                                    return (<li key={network.label}>
                                        <span onClick={() => handleSwitchNetwork(networkId)} className="block cursor-pointer py-2 px-4 text-lg text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white flex items-center gap-2"><img className="max-h-[30px]" src={network.image} alt={network.label} />{network.label}</span>
                                    </li>)
                                })}
                            </ul>
                        </div>}
                    </div>
                    <button onClick={handleConnect} className={`${account === undefined ? "text-white bg-[#f79420] hover:bg-[#f7a531]" : "bg-white text-[#f79420]"} rounded-lg font-medium py-2 px-4`}>{account ? account.slice(0, 4) + "..." + account.slice(account.length - 4, account.length) : 'Connect'}</button>
                </div>
            </div>
            <div className="bg-gradient-to-r from-[#e48b24] to-[#85623a] flex items-center justify-between px-4 pt-2 pb-1 md:pb-0">
                <div className="flex flex-col ml-12 items-start">
                    <span className="text-white text-4xl font-bold max-w-[650px] leading-normal lg:block hidden">Mint and List Nfts on Multiple Network</span>
                    <a href="https://app.bidify.org" target="_blank" rel="noreferrer" className="hidden items-center gap-1 sm:flex bg-black text-white px-6 py-4 text-lg mt-4 mb-12 rounded-lg font-medium hover:bg-gray-700">Explore Marketplace
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                </div>
                <img className="min-w-[100px] lg:min-w-[400px] mb-12 mr-12" src={bannerImg} alt="hero" />
            </div>
            <div className="mx-2 sm:mx-16 shadow-xl rounded-lg py-4 mb-8 mt-[-70px] md:mt-[-80px] bg-white z-33">
                {showAlert && <div id="alert-additional-content-3" className="max-w-5xl mt-8 mx-4 lg:mx-auto p-4 mb-4 bg-green-100 rounded-lg dark:bg-green-200" role="alert">
                    <div className="flex items-center">
                        <svg className="mr-2 w-5 h-5 text-green-700 dark:text-green-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                        <h3 className="text-lg font-medium text-green-700 dark:text-green-800">NFT Minted successfully!</h3>
                    </div>
                    <div className="mt-2 mb-4 text-sm text-green-700 dark:text-green-800">
                        More info about this info success goes here. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.
                    </div>
                    <div className="flex">
                        <a href={`${explorer[chainId]}/tx/${transaction}`} target="_blank" rel="noreferrer" className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center dark:bg-green-800 dark:hover:bg-green-900">
                            <svg className="-ml-0.5 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>
                            View Transaction
                        </a>
                        <button type="button" className="text-green-700 bg-transparent border border-green-700 hover:bg-green-800 hover:text-white focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:border-green-800 dark:text-green-800 dark:hover:text-white" onClick={() => setShowAlert(false)}>
                            Dismiss
                        </button>
                    </div>
                </div>}
                <div className="flex flex-col-reverse md:flex-row px-6 gap-4 my-8 items-center max-w-5xl mx-auto">
                    <div className="flex w-full flex-col items-center">
                        <span className="text-4xl text-[#e48b24] font-bold">Preview</span>
                        <div className="mt-8 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                            <img className={`rounded-t-lg ${buffer ? "" : "animate-pulse"}`} src={buffer ? `data:${type};base64,${buffer.toString('base64')}` : preview} alt="preview" />
                            <div className="p-5 gap-4 flex flex-col">
                                {name ? <h5 className="text-2xl font-bold tracking-tight break-words text-gray-900 dark:text-white">{name}</h5> :
                                    <div className="w-1/2 animate-pulse min-h-[20px] bg-gray-300 rounded-full"></div>
                                }
                                {description ? <pre className="font-normal break-words text-gray-700 dark:text-gray-400 whitespace-pre-wrap">{description}</pre> :
                                    <div className="flex flex-col animate-pulse gap-2">
                                        <div className="w-full min-h-[15px] bg-gray-300 rounded-full"></div>
                                        <div className="w-1/2 min-h-[15px] bg-gray-300 rounded-full"></div>
                                        <div className="w-full min-h-[15px] bg-gray-300 rounded-full"></div>
                                    </div>
                                }
                                {forSale && <div className="flex justify-between">
                                    {bid ? <span className="">{bid} {getSymbol()}</span> : <div className="w-[50px] animate-pulse min-h-[15px] bg-gray-300 rounded-full"></div>}
                                    {duration ? <span className="">{duration} Days</span> : <div className="w-[50px] animate-pulse min-h-[15px] bg-gray-300 rounded-full"></div>}
                                </div>}
                            </div>
                        </div>
                        <button type="submit" className="flex sm:hidden items-center justify-center self-center w-1/2 mt-8 text-white bg-[#f79420] hover:bg-[#f7a531] focus:ring-4 focus:ring-[#f7b541] font-medium rounded-lg text-sm px-12 py-2.5 text-center dark:bg-[#f7a531] dark:hover:bg-[#f7b541] dark:focus:ring-[#f7b541]" onClick={onSubmit} disabled={loading}>
                            {loading && <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                            </svg>}
                            Mint
                        </button>
                    </div>
                    <div className="flex w-full flex-col">
                        {/* File Upload */}
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="user_avatar">Upload file</label>
                        <input className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" type="file" accept="image/png, image/gif, image/jpeg" onChange={readImage} />
                        {/* Title */}
                        <label htmlFor="title" className="mt-4 block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Title</label>
                        <input type="text" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#f79420] focus:border-[#f79420] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#f79420] dark:focus:border-[#f79420]" onChange={(e) => setName(e.target.value)} />
                        {/* Description     */}
                        <label htmlFor="message" className="mt-4 block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Description</label>
                        <textarea id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-[#f79420] focus:border-[#f79420] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#f79420] dark:focus:border-[#f79420]" placeholder="" onChange={(e) => setDescription(e.target.value)} />
                        {/* Amount */}
                        <label htmlFor="amount" className="mt-4 block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Amount</label>
                        <input type="number" id="amount" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#f79420] focus:border-[#f79420] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#f79420] dark:focus:border-[#f79420]" onChange={(e) => setAmount(e.target.value)} defaultValue={1} min={1} />
                        {/* Is for Sale     */}
                        <div className="flex items-center mt-4">
                            <input id="checkbox-3" aria-describedby="checkbox-3" type="checkbox" className="w-4 h-4 text-[#f79420] bg-gray-100 rounded border-gray-300 focus:ring-[#f79420] dark:focus:ring-[#f79420] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onChange={(e) => setForSale(e.target.checked)} />
                            <label htmlFor="checkbox-3" className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Is For Sale?</label>
                        </div>
                        {/* Initial Bid     */}
                        {forSale && !approved &&
                            <button type="submit" className="flex items-center justify-center mt-8 text-white bg-[#f79420] hover:bg-[#f7a531] focus:ring-4 focus:ring-[#f7b541] font-medium rounded-lg text-sm px-12 py-2.5 text-center dark:bg-[#f7a531] dark:hover:bg-[#f7b541] dark:focus:ring-[#f7b541]" onClick={signList} disabled={approving}>
                                {approving && <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                </svg>}
                                Approve
                            </button>
                        }
                        {forSale && approved && <div className="flex">
                            <span className="min-w-[120px] text-center mt-4 inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                Initial Bid
                            </span>
                            <input type="number" id="website-admin" className="mt-4 rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-[#f79420] focus:border-[#f79420] block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#f79420] dark:focus:border-[#f79420]" onChange={(e) => setBid(e.target.value)} />
                        </div>}
                        {/* Auction Length     */}
                        {forSale && approved && <div className="flex">
                            <span className="min-w-[120px] text-center mt-4 inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                Auction Length
                            </span>
                            <input type="number" id="website-admin" className="mt-4 rounded-none bg-gray-50 border border-gray-300 text-gray-900 focus:ring-[#f79420] focus:border-[#f79420] block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#f79420] dark:focus:border-[#f79420]" onChange={(e) => setDuration(e.target.value)} />
                            <span className="mt-4 inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-r-md border border-l-0 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                Days
                            </span>
                        </div>}

                        <button type="submit" className="hidden sm:flex items-center justify-center self-center w-1/2 mt-8 text-white bg-[#f79420] hover:bg-[#f7a531] focus:ring-4 focus:ring-[#f7b541] font-medium rounded-lg text-sm px-12 py-2.5 text-center dark:bg-[#f7a531] dark:hover:bg-[#f7b541] dark:focus:ring-[#f7b541]" onClick={onSubmit} disabled={loading}>
                            {loading && <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                            </svg>}
                            Mint
                        </button>

                        {loading && <div className="overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-0 z-50 justify-center items-center md:inset-0 h-modal w-full bg-[#0003] flex h-full" id="popup-modal">
                            <div className="relative px-4 w-full max-w-md h-auto">
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                    <div className="p-6 pt-16 pb-8 text-center">
                                        <svg role="status" className="inline mr-2 w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                        <h3 className="mb-5 text-lg mt-3 font-normal text-gray-500 dark:text-gray-400">{modalContents[modalContent]}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>

        </div>
    )
}
