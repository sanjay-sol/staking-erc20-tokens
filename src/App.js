import "./App.css";
import { ethers } from "ethers";
import Uploadabi from "./Abi.json";
import { useState, useEffect } from "react";

function App() {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setaddress] = useState("");
  const [balance, setbalance] = useState("");
  const [amount, setamount] = useState("");
  const [amount1, setamount1] = useState("");
  const [mintamount, setmintamount] = useState("");

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

        let contractAddress = "0xFC01069a3278195eD0dd85545f50e1296dFE447e";

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
    try {
      const bal = await contract.balanceOf(addressval);
    setbalance(bal.toNumber());
    } catch (error) {
      alert(error.message); 
    }
  };
  const stakeTokens = async (amount) => {
    try {
    await contract.stake(amount);  
    } catch (error) {
      alert(error.message);
    }
  };
  const claimAwards = async () => {
    try {
    await contract.claim(); 
    } catch (error) {
      alert(error.message);
    }
  };
  const unstakeTokens = async (amount1) => {
    try {
      const a = await contract.unstake(amount1);
      console.log(a);
    } catch (error) {
      alert(error.message);
    }
  };
  const mintTokens = async(amount) => {
    try {
      await contract.mint(amount);
    } catch (error) {
      alert(error.message);
      
    }
  }
  return (
    <>
    <div className="App flex flex-col justify-center items-center">
      <div className="bg-gray-200 w-8/12 rounded-lg pb-3  " >

      {signer ? (
        <>
        <p className="font-extrabold text-lg mt-4">Account : {account}</p>

      </>
      ) : (
        <>
      <button className="bg-teal-600 rounded-lg p-2 mt-5 text-lg font-extrabold" onClick={() => connectW()}> Connect Wallet  </button><span className="text-sm text-red-600 font-bold">(Unlock your Metamask or Click again if you don't see your address)</span>
      </>
      )}
      <br />
      <label className="font-bold text-lg">
      Check Balance : 
              </label>
              <input
                type="text"
                className="ml-5 w-48 p-2 mt-2 text-xl placeholder-gray-400 border-gray-500 border-2 bg-gray-300 rounded-lg focus:outline-none "
                data-primary="blue-600"
                onChange={(e) => setaddress(e.target.value)}
                data-rounded="rounded-lg"
                placeholder="Address..."
               
              />
      {address ? 
      <button className="bg-green-300 p-2 ml-10 text-base font-bold rounded-lg" onClick={() => getBalance(address)}>Get Balance</button>
      :
      <button className="bg-green-100 p-2 ml-10 text-base font-semibold rounded-lg" disabled >Get Balance</button>

    }
      {balance ? <p className="text-sm font-semibold mt-3" >Your balance is : {balance} STC</p> : ""}
     <br />
      <label className="font-bold text-lg">
      Mint Tokens : 
              </label>
              <input
                type="text"
                className="ml-5 w-48 p-2 mt-2 text-xl placeholder-gray-400 border-gray-500 border-2 bg-gray-300 rounded-lg focus:outline-none "
                data-primary="blue-600"
                onChange={(e) => setmintamount(e.target.value)}
                data-rounded="rounded-lg"
                placeholder="Amount > 0"
               
              />
              {mintamount ? 
      <button className="bg-green-300 p-2 ml-10 text-base font-bold rounded-lg" onClick={() => mintTokens(mintamount)}>Mint </button>
      :
      <button className="bg-green-100 p-2 ml-10 text-base font-semibold rounded-lg" disabled >Mint</button>

    }
    <br />
    <p className="text-sm text-red-600 font-bold">Check Balance to confirm your minted tokens</p>
      </div>
      <br />
      <div className="bg-gray-200 w-8/12 rounded-lg pb-3 p-3 ">
      <h1 className="font-extrabold text-2xl text-emerald-900 underline" >Stake , Unstake and Claim Rewards</h1>
      <label className="font-bold text-lg">
      Enter amount to stake : 
              </label>
              <input
                type="number"
                className="ml-5 w-48 p-2 mt-2 text-xl placeholder-gray-500 border-gray-500 border-2 bg-gray-300 rounded-lg focus:outline-none "
                data-primary="blue-600"
                onChange={(e) => setamount(e.target.value)}
                data-rounded="rounded-lg"
                placeholder="Amount > 100"
               
              />
      {amount>100 ? 
      <button className="bg-yellow-300 p-2 ml-10 text-base font-bold rounded-lg" onClick={() => stakeTokens(amount)}>Stake</button>
      :
      <button className="bg-yellow-100 p-2 ml-10 text-base font-semibold rounded-lg" disabled >Stake</button>

    }
      <br />
      <label className="font-bold text-lg">
       
      Claim Rewards till now ( wait for few seconds after staking ): 
              </label>
              {amount ? 
      <button className="bg-sky-300 p-2 ml-2 text-base font-bold rounded-lg mt-4" onClick={() => claimAwards()}>Claim</button>
        :
      <button className="bg-sky-200 p-2 ml-2 text-base font-semibold rounded-lg mt-4" disabled >Claim</button>

      }
      <br />
      <span className="text-sm text-red-600 font-bold">(Check Balance to see your rewarded tokens)</span>
      <br />
      <label className="font-bold text-lg">
     Unstake your Tokens : 
              </label>
              <input
                type="number"
                className="ml-5 w-52 p-2 mt-2 text-xl placeholder-gray-500 border-gray-500 border-2 bg-gray-300 rounded-lg focus:outline-none "
                data-primary="blue-600"
                onChange={(e) => setamount1(e.target.value)}
                data-rounded="rounded-lg"
                placeholder="Amount <= staked amount"
               
              />
      {amount1 ? 
      <button className="bg-red-300 p-2 ml-2 text-base font-bold rounded-lg mt-4" onClick={() => unstakeTokens(amount1)}>Unstake</button>
      :
      <button className="bg-red-200 p-2 ml-2 text-base font-semibold rounded-lg mt-4" disabled>Unstake</button>

    }
      <br />
      </div>
    </div>
    </>
  );
}

export default App;
