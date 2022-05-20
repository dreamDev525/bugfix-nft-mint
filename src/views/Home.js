import React, { useEffect, useRef, useState } from "react"
import bannerImg from "../assets/images/heroIllustration.svg"
import bidifyLogo from "../assets/images/bidify.png"
import disturb from "../assets/images/disturb.png"
import preview from "../assets/images/preview.svg"
import mintLogo from "../assets/images/mintlogo.png"
import info from "../assets/images/info.png"
import instagram from "../assets/images/telegram.png"
import tweeter from "../assets/images/tweeter.png"
import facebook from "../assets/images/facebook.png"

import { useWeb3React } from "@web3-react/core"
import { FetchWrapper } from "use-nft";
import { injected } from "../connectors"
import { switchNetwork } from "../wallet"
import { addresses, ABI, NETWORKS, supportedChainIds, explorer, BIDIFY, getLogUrl, snowApi, baseUrl, ERC721_ABI, standard } from "../constants"
import { ethers, Contract } from "ethers"
import { Buffer } from "buffer"
import axios from "axios"
// import Arweave from "arweave"

import { create } from 'ipfs-http-client'
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
const modalContents = {
    ipfs: "Uploading data to the IPFS...",
    mint: "Minting NFTs...",
    database: "Adding to database...",
    list: "Creating Auctions... \nThis will take a few minutes and you should to confirm transactions several times."
}
const transakURL = "https://staging-global.transak.com/?apiKey=a26373cf-a121-43b0-a2c1-d3bf8253666f"
const transackLogo = "https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=1.25,format=auto/https%3A%2F%2F2568214732-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FyKT7ulakWzij4PDiIp6U%252Ficon%252FTbk5OkyEAiidHiC1yXpm%252FsK_Kgoxa_400x400.jpeg%3Falt%3Dmedia%26token%3Dacdf28e9-2036-4d48-93ce-dbd0eb6f5714"

// const arweave = Arweave.init({
//     host: "arweave.net",
//     port: 443,
//     protocol: "https",
//     timeout: 200000, // Network request timeouts in milliseconds
//     logging: false, // Disable network request logging
// });
// // Submits a transaction and reads the data
// const KEY = {
//     "d":"Wf9a445LKJ5BtXWbTv6UEVtjJi5mUoTcxVNbtea8Xutaz7PHgHsc4kchRmoa4ZiGCUXcRX2OK6CHL4OhyUxid9PMKPS4A-YiFshdVDIERP_PrE1l23uHbAigMvjmv0W7DXRd7EJ7qqD0zYx0Pqq5k1xVXXJELOgrzWkKYEQbIoYosCcZcTUTL2TVdo3dGYmnKynORJbFEVwAr-zp3a6zXb-mIJs8x44xdsU1lIzJmjZC9VHWzzOlNdJ3tSxgQgF-rkjB3kYBLEpjw1AGzP-Hx3qFbwmqgO7GAhxeznZtYUjqYQTFs_vDqRiq90zX6cnKP-k4G5rNfRlMb0u5Z95f0NK3lWAHcp22EGGcCiN2yGABPWUN0akwlSFhpwMVTj0kdJd9t-w36eryIR9FTdym8dhhvxZ26PqxRYJDuZuZZLwPMZKE9kGxOYP5deHMpuQPJG-hgvp148vdYk481y2sIzN6e3P3YM_1ftllFbVIIpZO-21Q_dQSVk1iTjn853fa16b6G2rFbv7AQ4xwfvq6i03KRghKjm4o4a4tUSMC8Lch0BVhIwyLh9dCH8LOASqHvouVFyeTUBV-mTY_mvGoPd7T4PQqpqVbIGZ4Uff5QvVOzPnG72i8aFm_5qApYMbgCu6lROZPTDnnvwFGlPB9lKL6SyETA95TxZQBnKOu0UE",
//     "dp":"6WlDC3U8drYn_4fxF6CI8jISG45JMf1XBIX-Vcd8QvbfDDS4IuJwowArYfsGUGJSxgNZTRlcb4bvO4GRKVg3ioYybg7NVEFhAoP5Xw6ozfS5Vub6k8SykV2oid4mMEYu6NmitjMTGVDB099XoJG1eMNduEkrm_M7MrBtiwiebZcESpCkig1jHeMTlmahrSmquK7RLDakZX0X_cP3M-nCJsRwWjAg9Bzew_Ld1xqgrVdcAh8kzi5fPtduo2alk0iZk7-rptqL3t8wEl1DIbkvDAs-Ns4s9e3GMYGjTsBGSkWMvYLvjQGrKUKOBtFDkDHx6Q9lG6P7vroTcnmhOy_VeQ",
//     "dq":"UXCTaAW83yZNKTy9aj4SUsOb8QxGY0k5tlPZcs83ISilbjUPb9zp5gkeHuVU-9kISQuEenbcJtskZk43nE1mGmjZ6KuZtLuAkjfuo8vEYKe8tn63dnryD8vSBfyPkhHkVvR3K7Bwb5yZxa-cNaG-coh6HqzpLI8sLJ5rJ0Y7Nj_KD3N52GI7TfQnXC6FUtSIFeuQETTd64Ue1gHLFM5_X_cGHT7AgbKZpZyw8GC5ADtAl3m0k63ZjqPPJHOZQK11tNiapRB-wXcJOTx-LxhmOK9ZLV6PdVISJv16AhQVCdb7MsPYalU3JvviFb54gJ-wJDLh5awgLdMCPKqCn2OesQ",
//     "e":"AQAB",
//     "ext":true,
//     "kty":"RSA",
//     "n":"oxclfOz01Ej7vmPba_S5YCyK5QF_RhvB6-IipuPLHrK_pCMiA8xrmwetXEQbH5LfZrtiHOE2ZM4fVJpaOzUJ7tCbtSupOEw1du6Q538AbMHY09Rh49nS9mFj091_IIQE-kTtesSotOgl39uLHF7_V6BNMsltiVmOp0ZeFbFETngXUcABh_pPwGfHggX1MZdlfh0EvQk8OBlT6sZ7_oDac2rzYWtQuUFvcj9UB3apKK4dfJyGP0lYURdHRcZnaGppUJnObaXMuWa_SrMekNw1bDpVrVQ2LzIIFxCiYFlx5pqU4Mi98K2Q_5lNmmt2d0mgH9mpfYhOts4ZY2gnRQIkgywB_xCU3xOoautlAGeSpPP_Ytoj1Tb0B0l8SE0D0ttGSQg0Veg80BCb6f8E7PMA1Uhat_k8UN7lJ04FvzVAtiZhvEjSsRHknH6VWPomEsU6uc0YtYjlNRfC-4C5oR8U0_maCoKpGPTUR-m-nC5lL0txYP-O17s1Hox17UEHgaApHnvj9zTOvvf3tBYol26sZDvTmZxYEp43yyaFdpI7OUOXvsT3uitbPg2uMHblqVMgP1uvTeNAugSQH6hPWqauEy6AaKd1hSEJBT3yX1YhPvbfufN_cA4Qp4Q_AK_mzHoX9Zk7YA6eFv4v_PHWR2ydfBofJcTVXulSAW8f3noQfb0",
//     "p":"7W-utDm6OWeFktqw2mSQncchudxF1xkwOPP0on5iB3-lepVHnBlptcsMy6FV1ZS19Uu1lcokAP-zdpT2j_22-h48DJ_5BMl2zQHiDS0pr1vfp2AL7ntRB2ZPhE5b0IaGeh4JzlqFzIiz4JDfqbMkzAV2KgEETcgYwUGSjOUStVOqp4dT4GDQ9U3Q4SqGdtKM0OtmiaCOxzU-VynknSJIt9Om0_ugLL_av0sRRuHO3vK5yxGlcKmtIeewEDurtG6EDOk6quc5S9nx8JaCFww_4jkuMFHm4zfwrNU5VwLbbfq0C7qH2Pf7Zv5J3aZZqj2pd87IxZG9TYPsLp86GsERzQ",
//     "q":"r9dsGtR-_b26PwTJojm1-Pt1wP_Izbia-ynflbxs8BmPbc697TqJ_WCL3wBPoLY2FH5BHGz9k7eYcQn1v59mOl85PPdGHYvfoKpO9SpmTyEuzYASQu-35Q997YR0JIx_ob9UFK1WqSViFR0fPe5fmCZ_qwsshOP2fA26kWYIBDVoQ6eFO2-JyhFeUj-OHg7RZ8ufylVUKsUF_UF7qEPYag27Ow3sLwVd8vsJdrCsEENYQIX3shbmiqawhxqBf9dvbOUqt0P8Vto_EotPN8vjbzd8mld38LJTdLMMHbSkcoBb2FoJE5ssrVROycPZolUj4tfygpf7KI19qCPScCzrsQ",
//     "qi":"sJocBN4rvpmHqbMBTJbAW7Cu4DcWrlrLQPZpK4jeHj9cMOJXyLBwRZYMlXTl4IWZYWUqMslJLiS4z7wEpZ8fxPQGB1o3k1L0PQO3HUuN6rtwFKd7uK4fDxFe8K3yuykWEjzgPkpC5uVz3-dXmmmQClUOHRnlR0bGod_eI8g1ZAu6yJ1QmaYpJ4t63xT4lQCnRLBkOmdppL_ImM5AHTDPqIbm7Cqb2eHIOoXWgYtufRhMRmlMG4mAu6y8N1OXN6B_YzBlIdA64zRS0MLhcIPyQXsT7fPqBizyTI4rx3V7mZxNbbNfEGCyp7ZqhOUcR97LG-XrUPeDN9gZjfutMvfwLQ"
//  }
// async function run() {
//     // The data we're uploading
//     const imageDataUri =
//       "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAYAAACLz2ctAAAAAXNSR0IArs4c6QAABLNJREFUeF7t28GO2zAMRdHk/z86RdtVAQ9AlmIoy2fWT6R1eaNEwPj9+Xw+L38IDBF4E3CIvLZ/CBCQCKMECDiKX3MCcmCUAAFH8WtOQA6MEiDgKH7NCciBUQIEHMWvOQE5MEqAgKP4NScgB0YJEHAUv+YE5MAoAQKO4tecgBwYJUDAUfyaE5ADowQIOIpf88cJ+H6//3vqXp/5b3Q/LiRggikBE7CCUQIGQf2OETABKxglYBAUAROgElECJmA5AROwgtFjBPzG5aLS42oehD7oveCKHFERKj0IeH0kOgETlwsCBr9XEzECEjChy/ooAQm43qpExe0FjH7tRX/HJdi0R0/eWxQeAaOkGnIEvMEt+OQhnby36OfVCRgl1ZAjoBOwQat4SQLeVMA7XjjiWj4recuvYAKeIykBz5nlLXdCwFuO7ZyHJuA5s7zlTrYS8OpW6PfeLb0KPzQBw6gEOwgQsIOqmmECBAyjEuwgQMAOqmqGCYwJ6MIRntHRQQIePd79N0fA/Wd09BMS8Ojx7r85Au4/o6Of8CsCunAc7VBpcwQs4bO4SoCAVYLWlwgQsITP4ioBAlYJWl8isFxAF47SPB63mICPG/leGybgXvN43NMQ8HEj32vDBNxrHo97mpKALhyP82X5hgm4HKmCGQIEzNCSXU6AgMuRKpghQMAMLdnlBAi4HKmCGQIEzNCSXU6AgMuRKpghQMAMLdnlBAi4HKmCGQIEzNCSXU6AgMuRKpghQMAMLdnlBAi4HKmCGQIEzNCSXU6AgMuRKpghQMAMLdnlBAi4HKmCGQIEzNCSXU6AgMuRKpghEBbQ+x8ZrLJRAgSMkpJrIUDAFqyKRgkQMEpKroUAAVuwKholQMAoKbkWAgRswapolAABo6TkWggQsAWrolECBIySkmshQMAWrIpGCRAwSkquhQABW7AqGiVAwCgpuRYCBGzBqmiUAAGjpORaCBCwBauiUQIEjJKSayFAwBasikYJEDBKSq6FwKWA3v9oYa3oBQEC0mKUAAFH8WtOQA6MEiDgKH7N3YI5MEqAgKP4NScgB0YJEHAUv+YE5MAoAQKO4tecgBwYJUDAUfyaE5ADowQIOIpf87CAV6j82xaBqgQIWCVofYkAAUv4LK4SIGCVoPUlAgQs4bO4SqAkoItJFb/1BOTAKAECjuLXnIAcGCVAwFH8mi8X0MWEVBkCBMzQkl1OgIDLkSqYIUDADC3Z5QQIuBypghkCXxEwejG5yn0+n8x+jsxe/dtbZaM7MSVgZZJfWkvABtBRqDt9WhswhEpGWYWKvV6vnZg6AaNTG8wRsAF+FOpOn9YGDKGSUVahYk7AKKa/uQr83eWN7m33feQm+m967Cs4+tDRId3xBh3dGwGjtjTkokMiYAP8L5R0An4B8k8toh8uJ+ANhuQEHBxSofX2J2Bhb6ULTKVvZe3Jp90VFwJWbGlYS8AGqFMlo7+xpp7vjj8bVrNyAq4mWqznBCwC3Gm5E3CnaVw/y9En4P74PSEBOTBKgICj+DUnIAdGCRBwFL/mBOTAKAECjuLXnIAcGCVAwFH8mhOQA6MECDiKX3MCcmCUAAFH8WtOQA6MEiDgKH7NfwER2jFdIT5jOQAAAABJRU5ErkJggg==";
//     const imageBuffer = Buffer.from(imageDataUri.split(",")[1], "base64");

//     // Create and submit transaction
//     const key = KEY;
//     const transaction = await arweave.createTransaction(
//       {
//         data: imageBuffer,
//       },
//       key
//     );

//     await arweave.transactions.sign(transaction, key);
//     await arweave.transactions.post(transaction);

//     // Transaction ID gets updated after arweave.transactions.post, which is a bit unintuitive
//     console.log("transaction ID", transaction.id);

//     // Read data back
//     const transactionData = await arweave.transactions.getData(transaction.id);
//     console.log(transactionData, "=====>>>>>>")
//     console.log(
//       "transaction data",
//       Buffer.from(transactionData, "base64").toString()
//     );
//   }
export const Home = () => {
    const { account, library, chainId, activate } = useWeb3React()
    const [buffer, setBuffer] = useState()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState(1)
    const [forSale, setForSale] = useState(false)
    const [bid, setBid] = useState(0)
    const [duration, setDuration] = useState(0)
    const [type, setType] = useState()
    const [loading, setLoading] = useState(false)
    const [approving, setApproving] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [transaction, setTransaction] = useState("")
    const [approved, setApproved] = useState(false)
    const [modalContent, setModalContent] = useState("")
    const [cost, setCost] = useState(0)
    const [collectionName, setCollectionName] = useState("")
    const [symbol, setSymbol] = useState("")
    const [collections, setCollections] = useState([])
    const [symbolEditable, setSymbolEditable] = useState(true)
    const [erc721, setErc721] = useState("")
    const [toast, setToast] = useState("")
    const [advanced, setAdvanced] = useState(false)

    const [open, setOpen] = useState(false)
    const [openCollection, setOpenCollection] = useState(false)
    const drop = useRef("network")
    const collection = useRef("collection")
    const handleClick = (e) => {

        if (!collection.current) return
        if (!drop.current) return
        if (!e.target.closest(`#${collection.current.id}`) && openCollection) {
            setOpenCollection(false);
        }
        if (!e.target.closest(`#${drop.current.id}`) && open) {
            setOpen(false);
        }
    }
    useEffect(() => {
        if (toast) {
            setTimeout(() => setToast(""), 8000)
        }
    }, [toast])
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
                setToast(error.message)
            })
        } catch (e) {
            console.log(e.message)
            setToast(e.message)
        }
    }
    const handleSwitchNetwork = async (id) => {
        setOpen(false)
        await switchNetwork(Number(id))
    }
    useEffect(() => {
        // run()
        handleConnect()
    }, [])
    const getLogo = () => {
        return mintLogo
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
            case 56:
                return "BNB"
            default: return "Currency"
        }
    }
    const readImage = event => {
        event.preventDefault()
        const file = event.target.files[0]
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
        } catch (e) {
            setToast(e.message)
            console.log(e.message)
        }
        return logs ? logs.length : 0;
    };
    const checkAllowd = async (address) => {
        const BidifyToken = new ethers.Contract(address, ERC721_ABI, library.getSigner())
        const allowed = await BidifyToken.isApprovedForAll(account, BIDIFY.address[chainId])
        setApproved(allowed)
    }
    const signList = async () => {
        setApproving(true)
        try {
            const BidifyToken = new ethers.Contract(erc721, ERC721_ABI, library.getSigner())
            const tx = await BidifyToken.setApprovalForAll(BIDIFY.address[chainId], true)
            await tx.wait()
            await checkAllowd(erc721)
            setApproving(false)
        } catch (e) {
            setApproving(false)
            setToast(e.message)
            console.log(e.message)
        }

    }
    const addToDatabase = async (data, forSale) => {
        try {
            if (forSale) {
                console.log("posting for sale...")
                const ret = await axios.post(`${baseUrl}/admin`, data)
                console.log("return", ret)
            } else {
                console.log("posting for minting...")
                const ret = await axios.post(`${baseUrl}/adminCollection`, data)
                console.log("return", ret)
            }
        } catch (error) {

            setToast(error.message)
            return console.log("adding database error", error)
        }
    }
    const list = async (token, price, days) => {
        const currency = "0x0000000000000000000000000000000000000000";
        const platform = erc721;
        const Bidify = new ethers.Contract(
            BIDIFY.address[chainId],
            BIDIFY.abi,
            library.getSigner()
        );
        try {
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
            await tx.wait()
        } catch (error) {

            setToast(error.message)
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
        if (currentBid.toString() === nextBid.toString()) {
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
    useEffect(() => {
        if (library) {
            const getCost = async () => {
                if (amount) {
                    console.log(amount)
                    const signer = library.getSigner()
                    const BidifyMinter = new ethers.Contract(addresses[chainId], ABI, signer)
                    const mintCost = await BidifyMinter.calculateCost(amount)
                    setCost(mintCost)
                }
                else setCost(0)
            }
            getCost()
            getData()
        }

    }, [amount, library])

    const getData = async () => {
        const signer = library.getSigner()
        try {

            const BidifyMinter = new ethers.Contract(addresses[chainId], ABI, signer)
            const collections = await BidifyMinter.getCollections()
            console.log("collections ", collections)
            setCollections(collections)
        } catch (e) {
            setToast(e.message)
            console.log(e)
        }
    }
    const onSubmit = async () => {
        // return console.log(buffer, name, description, collectionName, symbol)
        if (buffer === undefined || name === undefined || description === undefined || (advanced && (collectionName === '' || symbol === ''))) {
            setToast("Fields cannot be empty")
            return console.log("Fields cannot be empty")
        }
        if (amount < 1) {
            setToast("Invalid amount")
            return console.log("Invalid amount")
        }

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
            const dataToDatabase = {
                description: description,
                image: `https://dweb.link/ipfs/${result.path}`,
                metadataUrl: `https://api.allorigins.win/raw?url=https%3A%2F%2Fipfs.io%2Fipfs%2F${added.path}`,
                name: name,
                owner: account,
                platform: erc721,
                network: chainId,
                isERC721: true,
            }
            const tokenURIJson = `https://ipfs.io/ipfs/${added.path}`
            setModalContent("mint")
            const signer = library.getSigner()
            const BidifyMinter = new ethers.Contract(addresses[chainId], ABI, signer)
            let platform = ethers.constants.AddressZero
            for (let i = 0; i < collections.length; i++) {
                if (collections[i].name === collectionName) platform = collections[i].platform
            }
            let exist = platform === ethers.constants.AddressZero ? false : true
            if (!advanced) exist = true
            // return console.log(exist)
            const mintCost = await BidifyMinter.calculateCost(amount)
            // return console.log(advanced)
            const tx = await BidifyMinter.mint(tokenURIJson.toString(), amount, advanced ? collectionName : "Standard BidifyMint Nft", advanced ? symbol : "SBN", advanced ? platform : standard[chainId], { value: mintCost, from: account })
            const txHash = await tx.wait()
            // await signList()
            setTransaction(txHash.transactionHash)
            // console.log(txHash)
            console.log(txHash)
            if (!exist) {
                txHash.events.shift()
                // if(!advanced)txHash.logs.shift()
            }
            console.log(txHash.events)
            let tokenIds = []
            if (chainId === 4 || chainId === 43114 || chainId === 56) {
                tokenIds = txHash.events.map((event) => {
                    const hex = event.topics[3]
                    return Number(ethers.utils.hexValue(hex))
                })
            }
            if (chainId === 1987) {
                tokenIds = txHash.events.map((event) => {
                    const hex = event.topics[3]
                    return Number(ethers.utils.hexValue(hex))
                })
            }
            else if (chainId === 137) {
                for (let i = 1; i < txHash.events.length - 3; i++) {
                    const hex = txHash.events[i].topics[3]
                    tokenIds.push(Number(ethers.utils.hexValue(hex)))
                }
            }

            console.log("tokenIds", tokenIds)
            if (forSale) {
                setModalContent("list");

                const totalCount = await getLogs()
                for (let i = 0; i < tokenIds.length; i++) {
                    await list(tokenIds[i].toString(), bid, duration)
                }
                while (await getLogs() === totalCount) {
                    console.log("while loop: delaying")
                }
                console.log("end of loop")
                setModalContent("database")
                const pData = []
                for (let i = 0; i < tokenIds.length; i++) {
                    const listingDetail = getDetailFromId((i + totalCount).toString());
                    pData.push(listingDetail)
                }
                const data = await Promise.all(pData);
                console.log("listed data", data)
                await addToDatabase(data, forSale)
            }
            else {
                setModalContent("database")
                const data = []
                for (let i = 0; i < tokenIds.length; i++) {
                    data.push({ ...dataToDatabase, token: tokenIds[i].toString() })
                }
                await addToDatabase(data, forSale)
            }
            setShowAlert(true)
            setLoading(false)
            getData()
            if (type === '') {
                setType('none');
            }
        }).catch(err => {
            setToast(err.message)
            console.log("err", err)
            setLoading(false);
        })
    }
    useEffect(() => {
        let exist = false;
        for (let i = 0; i < collections.length; i++) {
            if (collections[i].name === collectionName) {
                exist = true;
                setSymbol(collections[i].symbol)
                if (chainId !== 56) setErc721(collections[i].platform)
                if (chainId !== 56) checkAllowd(collections[i].platform)
            }
        }
        if (exist) {
            setSymbolEditable(false)
            if (chainId === 56) setForSale(false)
        }
        else {
            setSymbolEditable(true)
            setSymbol("")
            setErc721("")
            setApproved(false)
            setForSale(false)
        }
    }, [collectionName])
    const handleSelectCollection = (item) => {
        setSymbolEditable(false)
        setOpenCollection(false)
        setCollectionName(item.name)
        setSymbol(item.symbol)
        if (chainId !== 56) setErc721(item.platform)
    }
    const handleDismiss = () => {
        setBuffer(null)
        setType(null)
        setName("")
        setCollectionName("")
        setSymbol("")
        setAmount(1)
        setDescription("")
        setBid(0)
        setDuration(0)
        setShowAlert(false)
    }
    const renderModal = () => {
        return (
            <div className="overflow-y-auto overflow-x-hidden fixed w-full bg-[rgba(0,0,0,0.4)] h-[100vh] flex justify-center items-center top-0 right-0 left-0 z-[999999] h-modal">
                <div className="relative p-4 w-full max-w-4xl md:h-auto mx-2">
                    <div className="relative bg-[#DCDAE9] rounded-3xl shadow-lg dark:bg-gray-700">
                        <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" onClick={handleDismiss}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </button>
                        <div className="p-6 text-center">
                            <img className="mx-auto -mt-12 mb-8 w-12 h-12 bg-[#FFEAD6] rounded-full p-2 text-gray-400 dark:text-gray-200" src={bidifyLogo} alt="logo" />
                            <h3 className="mb-5 text-xl font-medium text-[#F09132] ">Congratulations on your newly Minted NFT</h3>
                            <a href={`${explorer[chainId]}/tx/${transaction}`} target="_blank" rel="noreferrer"  className="self-center mt-4 text-white bg-[#e48b24] hover:bg-[#f7a531] focus:ring-4 focus:ring-[#f7b541] font-medium rounded-lg text-sm px-8 mx-auto py-2.5 text-center">
                                View Transaction
                            </a>
                            <img className={`mt-8 min-w-[240px] max-w-[240px] mx-auto rounded-lg ${buffer ? "" : "animate-pulse"}`} src={buffer ? `data:${type};base64,${buffer.toString('base64')}` : preview} alt="preview" />
                            <p className="text-xl mt-4 font-bold tracking-tight break-words text-[#AA5E0D]">{name}</p>
                            <div className="mt-6 flex gap-3 items-center justify-center">
                                <p className="text-[#F09132]">Share with the world</p>
                                <a href={`https://twitter.com/intent/tweet?url=${explorer[chainId]}/tx/${transaction}&text=Check%20out%20the%20new%20NFT%20I%27ve%20minted%20called%20${name}`}><img src={tweeter} alt="social" /></a>
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${explorer[chainId]}/tx/${transaction}&quote=Check%20out%20the%20new%20NFT%20I%27ve%20minted%20called%20${name}`}><img src={facebook} alt="social" /></a>
                                <a href={`https://t.me/share/url?url=${explorer[chainId]}/tx/${transaction}&text=Check%20out%20the%20new%20NFT%20I%27ve%20minted%20called%20${name}`}><img src={instagram} alt="social" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div>
            {/* <div className="z-[9999] fixed h-12 w-12 right-[30px] bottom-[50px] flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-12 w-12 bg-sky-500">
                    <a href={transakURL} target="_blank" rel="noreferrer">
                        <img className="rounded-full" src={transackLogo} alt="transack logo" />
                    </a>
                </span>
            </div> */}
            {/* <span className="flex h-3 w-3">
                
            </span> */}
            <div className="fixed w-full flex justify-between py-1 px-4 items-center shadow-xl z-[999999] bg-[#000000aa]">
                <img className="max-h-[40px] sm:max-h-[75px]" src={getLogo()} alt="logo" />
                <div className="flex my-0 sm:my-3 gap-0 sm:gap-4">
                    <div className="flex" ref={drop} id="network">
                        {account && <button onClick={() => setOpen(open => !open)} id="dropdownButton" className="text-white bg-[#f78410] hover:bg-[#e48b24] focus:ring-[#f7b541] font-medium rounded-full text-sm mx-1 sm:pr-2 p-1 sm:pr-4 text-center inline-flex items-center dark:bg-[#f7a531] dark:hover:bg-[#f7b541] dark:focus:ring-[#f7b541]" type="button"><img className="rounded-full max-h-[30px] mr-0 sm:mr-2" src={supportedChainIds.includes(chainId) ? NETWORKS[chainId].image : disturb} alt="unsupported" /><p className="hidden sm:block">{supportedChainIds.includes(chainId) ? NETWORKS[chainId].label : "Unsupported chain"}</p></button>}

                        {/* <!-- Dropdown menu --> */}
                        {open && <div className="z-10 mr-2 text-base list-none bg-white absolute top-[65px] rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
                            <ul className="py-1" aria-labelledby="dropdownButton">
                                {Object.keys(NETWORKS).map((networkId) => {
                                    const network = NETWORKS[networkId]
                                    return (<li key={network.label}>
                                        <span onClick={() => handleSwitchNetwork(networkId)} className="block cursor-pointer py-2 px-4 text-lg text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white flex items-center gap-2"><img className="max-h-[30px] rounded-full" src={network.image} alt={network.label} />{network.label}</span>
                                    </li>)
                                })}
                            </ul>
                        </div>}
                    </div>
                    <button onClick={handleConnect} className={`${account === undefined ? "text-white bg-[#e48b24] hover:bg-[#f7a531]" : "bg-[#f7841022] text-[#e48b24]"} rounded-lg font-medium py-2 px-4`}>{account ? account.slice(0, 4) + "..." + account.slice(account.length - 4, account.length) : 'Connect'}</button>
                </div>
            </div>
            <div className="bg-gradient-to-r from-[#e48b24] to-[#85623a] flex items-center justify-between px-4 pt-6 md:pt-24 pb-1 md:pb-0">
                <div className="flex flex-col ml-12 items-start">
                    <span className="text-white text-4xl font-bold max-w-[650px] leading-normal lg:block hidden">Mint and List Nfts on Multiple Network</span>
                    <a href="https://app.bidify.org" target="_blank" rel="noreferrer" className="hidden items-center gap-1 sm:flex bg-black text-white px-6 py-4 text-lg mt-4 mb-12 rounded-lg font-medium hover:bg-gray-700">Explore Marketplace
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                </div>
                <img className="min-w-[100px] lg:min-w-[400px] mb-12 mr-12 non-movable" src={bannerImg} alt="hero" />
            </div>
            <div className="mx-2 sm:mx-16 shadow-xl rounded-lg py-4 mb-8 mt-[-70px] md:mt-[-80px] bg-white z-33">
                <div className="flex flex-col-reverse md:flex-row px-6 gap-4 mb-8 items-center max-w-5xl mx-auto">
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
                        {Number(cost) > 0 && <p className="mt-4 self-center sm:hidden text-[#e48b24] flex items-center gap-1">fee = {`${ethers.utils.formatEther(cost)} ${getSymbol()}`}<img data-tooltip-target="tooltip-fee" className="w-[15px] h-[15px]" src={info} alt="info" /></p>}
                        <button type="submit" className="flex sm:hidden items-center justify-center self-center w-3/4 mt-4 text-white bg-[#e48b24] hover:bg-[#f7a531] focus:ring-4 focus:ring-[#f7b541] font-medium rounded-lg text-sm px-12 py-2.5 text-center dark:bg-[#f7a531] dark:hover:bg-[#f7b541] dark:focus:ring-[#f7b541]" onClick={onSubmit} disabled={loading}>
                            {loading && <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                            </svg>}
                            {advanced ? "Mint Advanced NFT" : "Mint Standard NFT"}
                        </button>
                    </div>
                    <div className="flex w-full flex-col">
                        <div className="flex w-full justify-center mt-8 items-center">

                            <span className="ml-3 text-lg font-medium text-gray-900 dark:text-gray-300 mr-3">Standard</span>
                            <label htmlFor="yellow-toggle" className="inline-flex relative items-center cursor-pointer">
                                <input type="checkbox" value="" onChange={(e) => { setAdvanced(e.target.checked) }} id="yellow-toggle" className="sr-only peer" checked={advanced} />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400"></div>
                            </label>
                            <span className="ml-3 text-lg font-medium text-gray-900 dark:text-gray-300">Advanced</span>
                        </div>
                        {/* File Upload */}
                        <label className="mt-4 block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="user_avatar">Upload file</label>
                        <input className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" type="file" accept="image/png, image/gif, image/jpeg" onChange={readImage} />
                        {/* Title */}
                        <label htmlFor="title" className="mt-4 block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center gap-1">Title<img data-tooltip-target="tooltip-title" className="w-[15px] h-[15px]" src={info} alt="info" /></label>
                        <div id="tooltip-title" role="tooltip" className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-[#e48b24] rounded-lg shadow-sm opacity-0 transition-opacity max-w-sm duration-300 tooltip dark:bg-gray-700">
                            The name of your NFT
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                        <input type="text" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#e48b24] focus:border-[#e48b24] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#e48b24] dark:focus:border-[#e48b24]" value={name} onChange={(e) => setName(e.target.value)} />
                        {/* Collection */}
                        {advanced && <div className="flex gap-2 mt-4">
                            <div className="flex-col flex-grow">
                                <label htmlFor="collection" className=" block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center gap-1">Collection<img data-tooltip-target="tooltip-collection" className="w-[15px] h-[15px]" src={info} alt="info" /></label>
                                <div id="tooltip-collection" role="tooltip" className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-[#e48b24] rounded-lg shadow-sm opacity-0 transition-opacity max-w-sm duration-300 tooltip dark:bg-gray-700">
                                    You may name your collection if you intend to mint multiple NFTs belonging to the same collection (Case Sensitive)
                                    <div className="tooltip-arrow" data-popper-arrow></div>
                                </div>
                                <div className="flex relative" ref={collection} id="collection">

                                    <input type="text" onClick={() => setOpenCollection(true)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#e48b24] focus:border-[#e48b24] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#e48b24] dark:focus:border-[#e48b24]" value={collectionName} onChange={(e) => setCollectionName(e.target.value)} />

                                    {/* <!-- Dropdown menu --> */}
                                    {openCollection && <div className="z-10 mr-2 text-base list-none bg-white w-full absolute top-[45px] rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
                                        <ul className="py-0 w-full" aria-labelledby="collectionField">
                                            {collections.filter(item => item.name.toLowerCase().includes(collectionName.toLowerCase())).map((item) => {
                                                // const network = NETWORKS[networkId]
                                                return (<li key={item.platform}>
                                                    <span onClick={() => handleSelectCollection(item)} className="block cursor-pointer py-1 px-4 w-full text-md text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white flex items-center gap-2">{item.name}</span>
                                                </li>)
                                            })}
                                        </ul>
                                    </div>}
                                </div>
                            </div>
                            <div className="flex-col">
                                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center gap-1">Symbol<img data-tooltip-target="tooltip-symbol" className="w-[15px] h-[15px]" src={info} alt="info" /></label>
                                <div id="tooltip-symbol" role="tooltip" className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-[#e48b24] rounded-lg shadow-sm opacity-0 transition-opacity max-w-sm duration-300 tooltip dark:bg-gray-700">
                                    Your collection should have a shortened 4 letter name
                                    <div className="tooltip-arrow" data-popper-arrow></div>
                                </div>
                                <input type="text" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#e48b24] focus:border-[#e48b24] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#e48b24] dark:focus:border-[#e48b24]" onChange={(e) => setSymbol(e.target.value)} maxLength={4} value={symbol} disabled={!symbolEditable} />
                            </div>
                        </div>}
                        {/* Description     */}
                        <label htmlFor="message" className="mt-4 block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400 flex items-center gap-1">Description<img data-tooltip-target="tooltip-description" className="w-[15px] h-[15px]" src={info} alt="info" /></label>
                        <div id="tooltip-description" role="tooltip" className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-[#e48b24] rounded-lg shadow-sm opacity-0 transition-opacity max-w-sm duration-300 tooltip dark:bg-gray-700">
                            Description of your NFT, here you may include information about the image, the inspiration and the meaning of your NFT
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                        <textarea id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-[#e48b24] focus:border-[#e48b24] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#e48b24] dark:focus:border-[#e48b24]" placeholder="" onChange={(e) => setDescription(e.target.value)} value={description} />
                        {/* Amount */}
                        <label htmlFor="amount" className="mt-4 block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center gap-1">Quantity <img data-tooltip-target="tooltip-amount" className="w-[15px] h-[15px]" src={info} alt="info" /></label>
                        <div id="tooltip-amount" role="tooltip" className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-[#e48b24] rounded-lg shadow-sm opacity-0 transition-opacity max-w-sm duration-300 tooltip dark:bg-gray-700">
                            The amount of NFTs to be minted, example choosing 4 will mint 4 identical NFTs
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                        <input type="number" id="amount" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#e48b24] focus:border-[#e48b24] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#e48b24] dark:focus:border-[#e48b24]" onChange={(e) => setAmount(Number(e.target.value))} defaultValue={1} min={1} />
                        {/* Is for Sale     */}
                        {erc721 && <div className="flex items-center mt-4">
                            <input id="checkbox-3" aria-describedby="checkbox-3" type="checkbox" className="w-4 h-4 text-[#e48b24] bg-gray-100 rounded border-gray-300 focus:ring-[#e48b24] dark:focus:ring-[#e48b24] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onChange={(e) => setForSale(e.target.checked)} />
                            <label htmlFor="checkbox-3" className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Is For Sale?</label>
                        </div>}
                        {/* Initial Bid     */}
                        {forSale && !approved &&
                            <button type="submit" className="flex items-center justify-center mt-8 text-white bg-[#e48b24] hover:bg-[#f7a531] focus:ring-4 focus:ring-[#f7b541] font-medium rounded-lg text-sm px-12 py-2.5 text-center dark:bg-[#f7a531] dark:hover:bg-[#f7b541] dark:focus:ring-[#f7b541]" onClick={signList} disabled={approving}>
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
                            <input type="number" id="website-admin" className="mt-4 rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-[#e48b24] focus:border-[#e48b24] block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#e48b24] dark:focus:border-[#e48b24]" onChange={(e) => setBid(e.target.value)} />
                        </div>}
                        {/* Auction Length     */}
                        {forSale && approved && <div className="flex">
                            <span className="min-w-[120px] text-center mt-4 inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                Auction Length
                            </span>
                            <input type="number" id="website-admin" className="mt-4 rounded-none bg-gray-50 border border-gray-300 text-gray-900 focus:ring-[#e48b24] focus:border-[#e48b24] block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#e48b24] dark:focus:border-[#e48b24]" onChange={(e) => setDuration(e.target.value)} />
                            <span className="mt-4 inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-r-md border border-l-0 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                Days
                            </span>
                        </div>}
                        <div className="mt-4 flex items-center gap-1 justify-center">{Number(cost) > 0 && <label className="self-center hidden sm:block text-[#e48b24]">fee = {`${ethers.utils.formatEther(cost)} ${getSymbol()}`}</label>}
                            <img data-tooltip-target="tooltip-fee" className="w-[15px] h-[15px]" src={info} alt="info" /></div>
                        <div id="tooltip-fee" role="tooltip" className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-[#e48b24] rounded-lg shadow-sm opacity-0 transition-opacity max-w-sm duration-300 tooltip dark:bg-gray-700">
                            This fee does not include the network fee, which is usually very small (except eth), the final fee will be displayed in your metamask
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                        <button type="submit" className="hidden sm:flex items-center justify-center self-center w-3/4 mt-2 text-white bg-[#e48b24] hover:bg-[#f7a531] focus:ring-4 focus:ring-[#f7b541] font-medium rounded-lg text-sm px-12 py-2.5 text-center dark:bg-[#f7a531] dark:hover:bg-[#f7b541] dark:focus:ring-[#f7b541]" onClick={onSubmit} disabled={loading}>
                            {loading && <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                            </svg>}
                            {advanced ? "Mint Advanced NFT" : "Mint Standard NFT"}
                        </button>

                        {loading && <div className="overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-0 z-50 justify-center items-center md:inset-0 h-modal w-full bg-[#0003] flex h-[100vh]" id="popup-modal">
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
            {toast && <div className={`w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:bg-gray-800 dark:text-gray-400 fixed top-24 right-5`} role="alert">
                <div className="flex">
                    <div className="ml-3 text-sm font-normal">
                        <div className="flex items-center gap-2">
                            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                            </div>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{toast}</span>
                        </div>
                        {/* <div className="text-sm font-normal mt-2">{toast}</div> */}
                    </div>
                    <button onClick={() => setToast("")} type="button" className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" aria-label="Close">
                        <span className="sr-only">Close</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </div>
            </div>}
            {showAlert && renderModal()}
        </div>
    )
}
