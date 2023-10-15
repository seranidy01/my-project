import React from "react";
import { makeStyles } from "@mui/styles";
import { AppBar, Container, Theme, Typography, Button } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: "static",
    height: 70,
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buyButton: {
    textTransform: "none", // Prevent text capitalization
  },
}));

interface IProps {}

const Navbar: React.FC<IProps> = () => {
  const classes = useStyles();

  return (
    <AppBar className={classes.root} sx={{ p: 2 }}>
      <Container maxWidth="xl" className={classes.container}>
        <Typography variant="h4">
          <b>Teddy Reflections Ecosystem</b>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className={classes.buyButton}
          component="a"
          href="https://app.pulsex.com/swap?outputCurrency=0x359C29e88992A7F4De7C0a00f78E3373d1A710Cb"
          target="_blank"
        >
          Buy TRS On PulseX
        </Button>
		<Button
          variant="contained"
          color="primary"
          className={classes.buyButton}
          component="a"
          href="https://app.pulsex.com/swap?outputCurrency=0x359C29e88992A7F4De7C0a00f78E3373d1A710Cb"
          target="_blank"
        >
          Buy AiF On PulseX
        </Button>
        <Button
          variant="contained"
          color="primary"
          component="a"
          href="https://scan.pulsechain.com/address/0x359C29e88992A7F4De7C0a00f78E3373d1A710Cb"
          target="_blank"
        >
          TRS Contract
        </Button>
		<Button
          variant="contained"
          color="primary"
          component="a"
          href="https://scan.pulsechain.com/address/"
          target="_blank"
        >
          AiF Contract
        </Button>
		<ConnectButton />
      </Container>
    </AppBar>
  );
};

export default Navbar;
