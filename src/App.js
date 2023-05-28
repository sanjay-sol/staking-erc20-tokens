import logo from "./logo.svg";
import "./App.css";
import { ethers } from "ethers";
// import * as ethers from "ethers";
// const {ethers} = require("ethers");
import Uploadabi from "./Abi.json";
import { useState, useEffect } from "react";
import { ConstructorFragment } from "ethers/lib/utils";

function App() {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setaddress] = useState("");
  const [balance, setbalance] = useState("");
  const [amount, setamount] = useState("");
  const [amount1, setamount1] = useState("");

  function connectW() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setSigner(signer);
        const address = await signer.getAddress();
        setAccount(address);

        let contractAddress = "0xfA8AB8e997B9fe3A65669243565fbde5B550041a";

        const contract = new ethers.Contract(
          contractAddress,
          Uploadabi,
          signer
        );

        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }
  const getBalance = async (addressval) => {
    const bal = await contract.balanceOf(addressval);
    setbalance(bal.toNumber());
  };
  const stakeTokens = async (amount) => {
    await contract.stake(amount);
  };
  const claimAwards = async () => {
    await contract.claim();
  };
  const unstakeTokens = async (amount1) => {
    try {
      const a = await contract.unstake(amount1);
      console.log(a);
    } catch (error) {
      console.log(error.message);
    }
  };

  console.log(address);
  console.log(balance);

  return (
    <div className="App">
      {!account ? (
        <button onClick={() => connectW()}> Connect Wallet</button>
      ) : (
        <p>Account : {account}</p>
      )}
      <label htmlFor="Address">Check Balance</label>
      <input type="text" onChange={(e) => setaddress(e.target.value)} />
      <button onClick={() => getBalance(address)}>Submit</button>
      {balance ? <p>Your balance is : {balance}</p> : ""}
      <br />
      <label htmlFor="stake">Enter amount to stake</label>
      <input type="number" onChange={(e) => setamount(e.target.value)} />
      <button onClick={() => stakeTokens(amount)}>Stake</button>
      <br />
      <button onClick={() => claimAwards()}>claim</button>
      <br />
      <input type="number" onChange={(e) => setamount1(e.target.value)} />
      <button onClick={() => unstakeTokens(amount1)}>UnStake</button>
      <br />
    </div>
  );
}

export default App;
