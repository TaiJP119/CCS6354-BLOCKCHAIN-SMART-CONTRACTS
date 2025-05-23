console.log("Ethers.js loaded:", typeof ethers !== "undefined");
// Smart Contract details
const contractAddress = "0x35B82fA8f57B6DAF115Cf1B7661d627e6a848396"; // Replace with your deployed contract address
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "newMessage",
                "type": "string"
            }
        ],
        "name": "setMessage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "initialMessage",
                "type": "string"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "message",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let provider, signer, contract;

// Function to connect MetaMask
async function connectMetaMask() {
    console.log("Connect MetaMask button clicked");

    if (typeof window.ethereum !== "undefined") {
        try {
            // Request MetaMask account
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const account = accounts[0];
            console.log("Connected account:", account);
            document.getElementById("accountDisplay").innerText =`Connected: ${account}`;

            // Initialize ethers.js objects
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);

            // Debugging logs
            console.log("Provider initialized:", provider);
            console.log("Signer initialized:", signer);
            console.log("Contract initialized:", contract);

            // Load contract data
            loadContractData();
        }
        catch (error) {
            console.error("MetaMask connection failed:", error);
        }
    } 
    else {
        alert("MetaMask is not installed. Please install it from https://metamask.io/download.html");
    }
}

// Function to load current message from the smart contract
async function loadContractData() {
    if (contract) {
        try {
            const message = await contract.message();
            document.getElementById("message").innerText = message;
        } 
        catch (error) {
            console.error("Error reading contract data:", error);
        }
    }
}

// Function to set a new message in the smart contract
async function setNewMessage() {
    if (!contract) {
        alert("Contract is not initialized. Please connect MetaMask first!");
        console.error("Contract instance is undefined. Make sure MetaMask is connected and contract is initialized.");
        return;
    } 
    
    try {
        const newMessage = document.getElementById("newMessage").value;

        if (!newMessage) {
            alert("Please enter a valid message.");
            return;
        }

        const tx = await contract.setMessage(newMessage);
        console.log("Transaction submitted:", tx.hash);

        await tx.wait(); // Wait for transaction confirmation
        console.log("Transaction confirmed");
        
        // Update the displayed message
        loadContractData();
    } catch (error) {
        console.error("Error setting new message:", error);
        alert("Failed to set the message. Check the console for details.");
    }
}

// Attach event listeners
document.getElementById("connectButton").onclick = connectMetaMask;
document.getElementById("setMessageButton").onclick = setNewMessage;