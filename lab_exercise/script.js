const contractAddress = "0xc2725095bCC3bEFb681Fe4FB07C28E36EA7CADA0";
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_goal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_durationMinutes",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "contributor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FundReceived",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalAmount",
				"type": "uint256"
			}
		],
		"name": "GoalReached",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "contributor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Refunded",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "checkBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contribute",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "contributions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contributorCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deadline",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getDetails",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "_goal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_deadline",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_raisedAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_contributorCount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_goalReached",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "_withdrawn",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "goal",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "goalReached",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "raisedAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "refund",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawn",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
let provider, signer, contract;
async function connectMetaMask() {
    if (typeof window.ethereum !== "undefined") {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Add this to log the current network
        const network = await provider.getNetwork();
        console.log("Connected to network:", network);

        document.getElementById("accountDisplay").innerText = `Connected: ${accounts[0]}`;
        loadContractInfo();
    } else {
        alert("Install MetaMask first!");
    }
}


async function loadContractInfo() {
    const [goal, deadline, raised, contributors] = await contract.getDetails();
    document.getElementById("goal").innerText = `${ethers.utils.formatEther(goal)} ETH`;
    document.getElementById("raised").innerText = `${ethers.utils.formatEther(raised)} ETH`;
    document.getElementById("deadline").innerText = new Date(deadline * 1000).toLocaleString();
    document.getElementById("contributors").innerText = contributors;

    // Deadline countdown
    const now = Math.floor(Date.now() / 1000);
    const secondsRemaining = deadline - now;
    let timeLeftText = "";
    if (secondsRemaining > 0) {
        // Format as hh:mm:ss
        const h = Math.floor(secondsRemaining / 3600);
        const m = Math.floor((secondsRemaining % 3600) / 60);
        const s = secondsRemaining % 60;
        timeLeftText = `Time left: ${h}h ${m}m ${s}s`;
    } else {
        timeLeftText = `<span class="highlight">Deadline passed!</span> Refund or withdrawal possible.`;
    }
    document.getElementById("timeLeft").innerHTML = timeLeftText;

    // Show connected user's contribution
    if (signer && contract) {
        const userAddress = await signer.getAddress();
        const userContribution = await contract.contributions(userAddress);
        if (userContribution.gt(0)) {
            document.getElementById("userContribution").innerText =
                `Your Contribution: ${ethers.utils.formatEther(userContribution)} ETH`;
        } else {
            document.getElementById("userContribution").innerText = "";
        }
        // Show owner badge
        const ownerAddr = await contract.owner();
        if (userAddress.toLowerCase() === ownerAddr.toLowerCase()) {
            document.getElementById("ownerBadge").style.display = "inline-block";
        } else {
            document.getElementById("ownerBadge").style.display = "none";
        }
    }
    if (signer && contract) await updateButtonStates();
}

async function contribute() {
    const amountWei = document.getElementById("contributionAmount").value;
    if (!amountWei || isNaN(amountWei)) return alert("Enter valid amount");

    // Make sure you pass the value as a string or BigNumber
    const tx = await contract.contribute({ value: amountWei.toString() });
    await tx.wait();
    alert("Contribution successful!");
    loadContractInfo();
}
async function refund() {
    try {
        // Show the address and contribution
        const userAddress = await signer.getAddress();
        const contribution = await contract.contributions(userAddress);
        const details = await contract.getDetails();
        const now = Math.floor(Date.now() / 1000);
        console.log("Refund attempt by:", userAddress);
        console.log("Contribution:", contribution.toString());
        console.log("Deadline:", details[1], "Now:", now, "Deadline passed?", now >= Number(details[1]));
        console.log("Goal reached:", details[4]);

        const tx = await contract.refund();
        await tx.wait();
        alert("Refund successful!");
        loadContractInfo();
    } catch (err) {
        console.error("Refund failed:", err);
        alert("Refund failed. Check console for details.");
    }
}

// async function mineBlockForTesting() {
// await network.provider.send("evm_increaseTime", [300]); // 5 minutes
// await network.provider.send("evm_mine");
//   alert("Mined 1 block to check time");
//   loadContractInfo();
// }



async function withdraw() {
    try {
        const tx = await contract.withdraw();
        await tx.wait();
        alert("Withdraw successful!");
        loadContractInfo(); // refresh UI
    } catch (err) {
        console.error(err);
        alert("Withdraw failed.");
    }
}


async function updateButtonStates() {
    const [goal, deadline, raised, contributors, goalReached, withdrawn] = await contract.getDetails();
    const userAddress = await signer.getAddress();
    const userContribution = await contract.contributions(userAddress);
    const now = Math.floor(Date.now() / 1000);

    document.getElementById("refundButton").disabled = !(
        now >= Number(deadline) &&
        !goalReached &&
        userContribution.gt(0)
    );

    const owner = await contract.owner();
    document.getElementById("withdrawButton").disabled = !(
        now >= Number(deadline) &&
        goalReached &&
        !withdrawn &&
        userAddress.toLowerCase() === owner.toLowerCase()
    );
}

document.getElementById("connectButton").onclick = connectMetaMask;
document.getElementById("contributeButton").onclick = contribute;
document.getElementById("refundButton").onclick = refund;
document.getElementById("withdrawButton").onclick = withdraw;
// document.getElementById("mineBlockButton").onclick = mineBlockForTesting;