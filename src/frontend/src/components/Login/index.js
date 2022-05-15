import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import Web3 from "web3";

let web3 = undefined;

const Login = ({ onLoggedIn }) => {
  const [loading, setLoading] = useState(false);

  const handleSignup = (publicAddress) =>
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
      body: JSON.stringify({ publicAddress }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).then((response) => response.json());

  const handleSignMessage = async ({ publicAddress, nonce }) => {
    try {
      const signature = await web3.eth.personal.sign(
        `I am signing my one-time nonce: ${nonce}`,
        publicAddress,
        ""
      );
      return { publicAddress, signature };
    } catch (err) {
      throw new Error("You need to sign the message to be able to log in.");
    }
  };

  const handleAuthenticate = ({ publicAddress, signature }) =>
    fetch(`${process.env.REACT_APP_BACKEND_URL}/auth`, {
      body: JSON.stringify({ publicAddress, signature }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then((response) => response.json());
  const handleClick = async () => {
    if (!window.ethereum) {
      window.alert("Please install MetaMask first.");
      return;
    }
    if (!web3) {
      try {
        await window.ethereum.enable();
        web3 = new Web3(window.ethereum);
      } catch (error) {
        window.alert("You need to allow MetaMask");
        return;
      }
    }
    const coinbase = await web3.eth.getCoinbase();
    if (!coinbase) {
      window.alert("Please activate MetaMask first.");
      return;
    }

    const publicAddress = coinbase.toLowerCase();
    setLoading(true);
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/users?publicAddress=${publicAddress}`
    )
      .then((response) => response.json())
      .then((users) => (users.length ? users[0] : handleSignup(publicAddress)))
      .then(handleSignMessage)
      .then(handleAuthenticate)
      .then(onLoggedIn)
      .then(() => setLoading(false))
      .catch((err) => {
        window.alert(err);
        setLoading(false);
      });
  };
  return (
    <Button
      display={{ base: "none", md: "inline-flex" }}
      fontSize={"sm"}
      fontWeight={600}
      color={"white"}
      bg={"pink.400"}
      href={"#"}
      _hover={{
        bg: "pink.300",
      }}
      onClick={handleClick}
    >
      {loading ? "Loading..." : "Login with MetaMask"}
    </Button>
  );
};

export default Login;
