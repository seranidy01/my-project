import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Theme,
  Snackbar,
  IconButton,
  CloseIcon,
} from "@mui/material";
import useWallet from "src/hooks/useWallet";
import background from "src/assets/images/background.jpg";
import Web3 from "web3";
import { erc20Abi } from "src/assets/abis/erc20";
import { routerAbi } from "src/assets/abis/router";
import MuiAlert from "@mui/material/Alert";


const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundImage: `url(${background})`, // Set the background image
    backgroundSize: "cover", // Adjust to your preference
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed", // Fixed background
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    fontSize: "1.5rem",
    padding: "10px 20px",
    border: "1px solid #000", // Add a border around the buttons
  },
  buttonContainer: {
    display: "flex",
    gap: "16px",
  },
  text: {
    border: "1px solid #000", // Add a border around the text
    padding: "10px",
  },
  input: {
    width: "100px",
  },
  balanceBox: {
    backgroundColor: "#f0f0f0", // Set your desired background color
    padding: "10px",
    marginTop: "16px", // Adjust the margin as needed
  },
  errorBox: {
    backgroundColor: "#ffcccc", // Set your desired background color
    padding: "10px",
    marginTop: "16px", // Adjust the margin as needed
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}



interface IProps {}

const App: React.FC<IProps> = () => {
  const classes = useStyles();
  const [errorMessages, setErrorMessages] = useState<string[]>([]); // New state for error messages
  const { currentAddress, walletClient } = useWallet();
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);
  const [burnStatus, setBurnStatus] = useState<string | null>(null);
  const [atropaBalance, setAtropaBalance] = useState<string | null>(null);
  const [burnAmount, setBurnAmount] = useState<string>("0"); // Initialize with 0
  const [isBurnDialogOpen, setIsBurnDialogOpen] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null); // State for the transaction hash

    useEffect(() => {
    if (currentAddress) {
      const atropaContractAddress = "0xCc78A0acDF847A2C1714D2A925bB4477df5d48a6";
      const web3 = new Web3(window.ethereum);
      const atropaTokenContract = new web3.eth.Contract(erc20Abi, atropaContractAddress);

      atropaTokenContract.methods.balanceOf(currentAddress).call()
        .then((balance) => {
          const decimals = 9; // Define the number of decimals to display
          const readableBalance = web3.utils.fromWei(balance, "ether");
          const roundedBalance = parseFloat(readableBalance).toFixed(decimals);
          setAtropaBalance(roundedBalance);
        })
        .catch((error) => {
          console.error("Error fetching Atropa balance: ", error);
        });
    }
  }, [currentAddress]);
const handleApproveRouter = async () => {
  if (!currentAddress || !walletClient) {
    // Ensure the user is connected and has a wallet client.
    return;
  }

  const atropaContractAddress = "0xCc78A0acDF847A2C1714D2A925bB4477df5d48a6";
  const routerAddress = "0x165C3410fC91EF562C50559f7d2289fEbed552d9";

  try {
    const web3 = new Web3(window.ethereum);

    const accounts = await web3.eth.getAccounts();
    const atropaTokenContract = new web3.eth.Contract(erc20Abi, atropaContractAddress);

    // Amount to approve (in this case, we're approving an unlimited amount)
    const approvalAmount = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"; 

    // Encode the data for the 'approve' function call
	const approveData = `0x095ea7b3${routerAddress.replace("0x", "").padStart(64, "0")}${approvalAmount.replace("0x", "").padStart(64, "0")}`;

    // Create a custom transaction for approval
    const approveTransaction = {
      from: accounts[0],
      to: atropaContractAddress,
      data: approveData,
    };

    // Send the transaction to approve
    const result = await web3.eth.sendTransaction(approveTransaction);

    console.log("Transaction result (Approve Router): ", result);

    setApprovalStatus("Approval successful for the router!");
  } catch (error) {
    console.error("Error approving for the router: ", error);
    setApprovalStatus("Failed to approve for the router.");
  }
};

  const handleBurn = () => {
    setIsBurnDialogOpen(true);
  };
  
  

const handleBurnConfirm = async () => {
  if (window.ethereum) {
    const burnAmountWei = Web3.utils.toWei(burnAmount, "ether");

    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const routerAddress = "0x165C3410fC91EF562C50559f7d2289fEbed552d9";
      const routerContract = new web3.eth.Contract(routerAbi, routerAddress);

      const path = [
        "0xCc78A0acDF847A2C1714D2A925bB4477df5d48a6",
        "0xA1077a294dDE1B09bB078844df40758a5D0f9a27",
        "0x359C29e88992A7F4De7C0a00f78E3373d1A710Cb",
      ];
      const amountIn = burnAmountWei;
      const amountOutMin = "0"; // You can adjust this accordingly
      const to = "0x0000000000000000000000000000000000000369";
      const deadline = "16970887559890";
	const baseFeeGwei = 460055464033654 / 1e9
	const suggestedGasPriceGwei = baseFeeGwei + 1000000
	const suggestedGasPriceWei = suggestedGasPriceGwei * 1e9
	const gasPrice = await web3.eth.getGasPrice();
	const gasPriceHex = web3.utils.toHex(suggestedGasPriceWei);
	const transaction = {
		from: accounts[0],
		to: routerAddress,
		data: routerContract.methods.swapExactTokensForTokens(
			amountIn,
			amountOutMin,
			path,
			to,
			deadline
			).encodeABI(),
		gasPrice: gasPriceHex,  // Use dynamic gas price
		gas: web3.utils.toHex(5000000),
	};

      // Send the transaction to burn Atropa and swap it
      const result = await web3.eth.sendTransaction(transaction);

      console.log("Transaction result (Burn & Swap): ", result);

      setBurnStatus("Burn and Swap successful!");
    } catch (error) {
      console.error("Error burning & swapping: ", error);
      setBurnStatus("Failed to burn & swap");
    }
  }
};

  const handleBurnCancel = () => {
    setIsBurnDialogOpen(false);
  };
  
  const showTransactionHashNotification = (hash) => {
    setTransactionHash(hash);
  };

  const closeTransactionHashNotification = () => {
    setTransactionHash(null);
  };
  

  return (
    <div className={classes.root}>
	
      <div className={classes.text}>
        <h1 style={{ color: 'white' }}>Atropa In Flames</h1>
      </div>


      <div className={classes.buttonContainer}>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleApproveRouter}
        >
          Approve
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          onClick={handleBurn}
        >
          Buy And Burn
        </Button>
      </div>
      <div className={classes.balanceBox}>
        {approvalStatus && <p>{approvalStatus}</p>}
        {burnStatus && <p>{burnStatus}</p>}
        {atropaBalance && (
          <p>
            Atropa Balance: {atropaBalance} ATROPA
          </p>
        )}
      </div>
	  )}

{errorMessages.length > 0 && (
  <div className={classes.errorBox}>
    {errorMessages.map((error, index) => (
      <div key={index} style={{ margin: '8px 0' }}>
        <p>{error}</p>
      </div>
    ))}
  </div>
)}
	  
      <div className={classes.balanceBox}>
        <p>Please make sure you approve before using the buy and burn function</p>
		<p>Note that when you use the Buy+Burn Function, the output will be sent to a dead wallet</p>
      </div>

      {/* Burn Confirmation Dialog */}
      <Dialog open={isBurnDialogOpen} onClose={handleBurnCancel}>
        <DialogTitle>Confirm Buy and Burn</DialogTitle>
        <DialogContent>
          <p>Enter the amount of Atropa you want to use to buy and burn TRS:</p>
          <TextField
            className={classes.input}
            inputProps={{
              type: 'text',
              inputMode: 'numeric',
            }}
            variant="outlined"
            label="Amount"
            value={burnAmount}
            onChange={(e) => setBurnAmount(e.target.value)}
          />
          <Button onClick={handleBurnCancel}>Cancel</Button>
          <Button onClick={handleBurnConfirm} color="secondary">
            Confirm Burn
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;
