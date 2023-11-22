import { useSelector, useDispatch } from "react-redux";
import Blockies from "react-blockies";

import logo from "../assets/logo.png";
import eth from "../assets/eth.svg";

import { loadAccount } from "../store/interactions";

import config from "../config.json";

const Navbar = () => {
  const provider = useSelector((state) => state.provider.connection);
  const chainId = useSelector((state) => state.provider.chainId);
  const account = useSelector((state) => state.provider.account);
  const balance = useSelector((state) => state.provider.balance);

  const dispatch = useDispatch();



  const connectHandler = async () => {
    /*loadAccount krne pr account with balance
    load hojata hai from interactions.js m se
    and connectHandler hum use kre kre hai jab hum button pr
    click krke account connect kr rha hai */
    await loadAccount(provider, dispatch);
  };


  const networkHandler = async (e) => {
    /*networkHandler is used to change the network we select from
    the network button in this code */
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: e.target.value }],//e.target.value is the value of the selected option network
    });
  };

  return (
    <div className="exchange__header grid">
      <div className="exchange__header--brand flex">
        <img src={logo} className="logo" alt="RAPP Logo"></img>
        <h1>RApp Token Exchange</h1>
      </div>

      <div className="exchange__header--networks flex">
        <img src={eth} alt="ETH Logo" className="Eth Logo" />

        {chainId && (
          //isma ye value utha rha hai ya select isko value nikal k paas kr rha hai shmj ni ara
          <select
            name="networks"
            id="networks"
            value={config[chainId] ? `0x${chainId.toString(16)}` : `0`}
            onChange={networkHandler}
          >
            <option value="0" disabled>
              Select Network
            </option>
            <option value="0x7A69">Localhost</option>
            <option value="0x1">Mainnet</option>
            <option value="0x13881">Mumbai</option>
          </select>
          /*we use 0x to convert the number to hexadecimal so
          that it can be compared with the hexadecimal 
          value of the network and if it matches then it will be selected*/
        )}
      </div>

      <div className="exchange__header--account flex">
        {balance ? (
          <p>
            <small>My Balance</small>
            {Number(balance).toFixed(4)}
          </p>
        ) : (
          <p>
            <small>My Balance</small>0 ETH
          </p>
        )}

        {/* ------------------------------------ */}
        {account ? (
          <a
            href={
              config[chainId]
                ? `${config[chainId].explorerURL}/address/${account}`
                : `#`
            }
            target="_blank"
            rel="noreferrer"
          >
            {account.slice(0, 5) + "..." + account.slice(38, 42)}
            <Blockies
              seed={account}
              size={10}
              scale={3}
              color="#2187D0"
              bgColor="#F1F2F9"
              spotColor="#767F92"
              className="identicon"
            />
          </a>
        ) : (
          <button className="button" onClick={connectHandler}>
            Connect
          </button>
        )}
        {/* ------------------------------------ */}
      </div>
    </div>
  );
};

export default Navbar;
