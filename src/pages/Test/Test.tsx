import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { makeStyles } from "@mui/styles";
import { Button, Theme, Typography } from "@mui/material";
import { erc20Abi } from "src/assets/abis/erc20";
import useWallet from "src/hooks/useWallet";
import { getContract } from "wagmi/actions";
import { awaitTransaction, toWei } from "src/utils/common";
import { notifyError, notifySuccess } from "src/api/notifications";
import { brc20Abi } from "src/assets/abis/brc20"; // Import the bdai ABI

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

interface IProps {}

const Test: React.FC<IProps> = () => {
  const classes = useStyles();
  const { currentAddress, walletClient, signer } = useWallet();
  const [canBurn, setCanBurn] = useState(false); // State to track if the user can burn DAI
  const [daiUserCanBurn, setDAIUserCanBurn] = useState<number | null>(null); // State to store the result
  const [burnedDAIChecked, setBurnedDAIChecked] = useState(false); // State to track whether we've checked burned DAI

  const handleApprove = async () => {
    if (!currentAddress) return;
    const contract = getContract({
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      abi: erc20Abi,
      walletClient,
    });

    const res = await awaitTransaction(
      contract.write.approve(
        "0x9F1226D338162Cfff753308CB464C83a7C9312e3",
        toWei("10000000000000000000000000000", 18)
      )
    );

    if (res.status) {
      notifySuccess("Success", "Transfer successful");
    } else {
      notifyError("Error", res.error);
    }
  };

  const handleCheckDAIUserCanBurn = async () => {
    if (!currentAddress) return;
    const contract = getContract({
      address: "0x9F1226D338162Cfff753308CB464C83a7C9312e3",
      abi: brc20Abi, // Use the bdai ABI
      walletClient,
    });

    try {
      // Call the 'burn' method
      const result = await contract.write.burn();
      console.log("Burn result:", result.toString()); // Convert the result to a string for logging

      if (result && result.toNumber) {
        // Convert the result to a number (assuming it's in wei)
        const burnableDAI = Number(result.toNumber());
        // Check if the user can burn DAI based on the result
        setDAIUserCanBurn(burnableDAI);
      } else {
        // Handle the case where there is no result or it's not a valid number
        console.error("Invalid result from burn method:", result);
        setDAIUserCanBurn(null); // Set to null or any appropriate default value
      }

      // Set the state to indicate that burned DAI has been checked
      setBurnedDAIChecked(true);
    } catch (error) {
      console.error("Error getting burnable DAI amount:", error);
      setDAIUserCanBurn(null); // Set to null or any appropriate default value
    }
  };

  useEffect(() => {
    // Check burned DAI only if it hasn't been checked before
    if (!burnedDAIChecked) {
      handleCheckDAIUserCanBurn();
    }
  }, [burnedDAIChecked]); // Run the effect when burnedDAIChecked changes

  return (
    <div className={classes.root}>
      Test Page
      <Button onClick={handleApprove}>Approve</Button>
      <Button onClick={handleCheckDAIUserCanBurn}>Burn DAI</Button>
      {daiUserCanBurn !== null && (
        <Typography>DAI User Can Burn: {daiUserCanBurn}</Typography>
      )}

      {/* Embed the external web page using an iframe */}
      <iframe
        src="https://v1-app.v4.testnet.pulsex.com/swap?outputCurrency=0x9F1226D338162Cfff753308CB464C83a7C9312e3"
        width="20%"  // Set the width to 100% to fill the container
        height="600px" // Set the desired height for the embedded window
        title="External Page"
      ></iframe>
    </div>
  );
};

export default Test;
