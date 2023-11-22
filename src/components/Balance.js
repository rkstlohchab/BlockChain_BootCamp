import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import RAPP from "../assets/dapp.svg";
import eth from "../assets/eth.svg";

import { loadBalances, transferTokens } from "../store/interactions";

const Balance = () => {

  //-------------------------------------------------------------------------------------------------------------


  const [isDeposit, setIsDeposit] = useState(true); //isDeposit is set to true
  //token1TransferAmount is the amount of token1 that the user wants to transfer
  //setToken1TransferAmount is a function that allows us to update the value of token1TransferAmount
  const [token1TransferAmount, setToken1TransferAmount] = useState(0); //token1TransferAmount is set to 0
  /*useState is a hook that allows you to add React state to 
  function components means that you can use state without writing a class*/
  const [token2TransferAmount, setToken2TransferAmount] = useState(0); //token1TransferAmount is set to 0

  const dispatch = useDispatch();

  const provider = useSelector((state) => state.provider.connection);
  const account = useSelector((state) => state.provider.account);

  const exchange = useSelector((state) => state.exchange.contract);
  const exchangeBalances = useSelector((state) => state.exchange.balances);
  const transferInProgress = useSelector(
    (state) => state.exchange.transferInProgress
  );

  const tokens = useSelector((state) => state.tokens.contracts);
  const symbols = useSelector((state) => state.tokens.symbols);
  const tokenBalances = useSelector((state) => state.tokens.balances);


  const depositRef = useRef(null);//useRef is a hook that allows you to create a reference to a DOM element
  const withdrawRef = useRef(null);



  //-------------------------------------------------------------------------------------------------------------



  const tabHandler = (e) => {
    if(e.target.className !== depositRef.current.className){
      depositRef.current.className = "tab";
      e.target.className = "tab tab--active";
      setIsDeposit(false)
    }else{
      withdrawRef.current.className = "tab";
      e.target.className = "tab tab--active";
      setIsDeposit(true)
    }
  };

  /*amountHandler is used to handler the input field amount and pass 
  it to the transferTokens function for the transfer of tokens from the wallet to the exchange*/
  const amountHandler = (e, token) => {
    //e.target.value is the value of the input field
    //if the token is token1 then setToken1TransferAmount to the value of the input field
    if (token.address === tokens[0].address) {
      setToken1TransferAmount(e.target.value); //setToken1TransferAmount to the value of the input field
    } else {
      setToken2TransferAmount(e.target.value);
    }
  };

  //depositHandler is used to deposit tokens into the exchange
  const depositHandler = (e, token) => {
    e.preventDefault();

    if (token.address === tokens[0].address) {
      //transferTokens is a function that allows us to transfer tokens from the wallet to the exchange
      transferTokens(
        provider,
        exchange,
        "Deposit",
        token,
        token1TransferAmount,
        dispatch
      );
      setToken1TransferAmount(0); //setToken1TransferAmount to 0 after the transfer is complete
    }else{
      transferTokens(
        provider,
        exchange,
        "Deposit",
        token,
        token2TransferAmount,
        dispatch
      );
      setToken2TransferAmount(0);
    }
  };

  const withdrawHandler = (e, token) => {
    e.preventDefault();

    if (token.address === tokens[0].address){
      transferTokens(
        provider,
        exchange,
        "Withdraw",
        token,
        token1TransferAmount,
        dispatch
      );
      setToken1TransferAmount(0)
    }else{
      transferTokens(
        provider,
        exchange,
        "Withdraw",
        token,
        token2TransferAmount,
        dispatch
      );
      setToken2TransferAmount(0);
    }
    
  };




  //-------------------------------------------------------------------------------------------------------------


  //useEffect is a hook that allows you to perform side effects in function components
  useEffect(() => {
    //if exchange, tokens, and account exist then loadBalances
    if (exchange && tokens[0] && tokens[1] && account) {
      loadBalances(exchange, tokens, account, dispatch);
    }
  }, [exchange, tokens, account, transferInProgress, dispatch]); //if any of these variable change then trigger this whole useffect


  //-------------------------------------------------------------------------------------------------------------


  return (
    <div className="component exchange__transfers">
      <div className="component__header flex-between">
        <h2>Balance</h2>
        <div className="tabs">
          <button
            onClick={tabHandler}
            ref={depositRef}
            className="tab tab--active"
          >
            Deposit
          </button>
          <button onClick={tabHandler} ref={withdrawRef} className="tab">
            Withdraw
          </button>
        </div>
      </div>

      {/* Deposit/Withdraw Component 1 (RAPP) */}

      <div className="exchange__transfers--form">
        <div className="flex-between">
          <p>
            <small>Token</small>
            <br />
            <img src={RAPP} alt="Token Logo" />
            {symbols && symbols[0]}
          </p>
          <p>
            <small>Wallet</small>
            <br />
            {tokenBalances && tokenBalances[0]}
          </p>
          <p>
            <small>Exchange</small>
            <br />
            {exchangeBalances && exchangeBalances[0]}
          </p>
        </div>

        <form
          onSubmit={
            isDeposit
              ? (e) => depositHandler(e, tokens[0])
              : (e) => withdrawHandler(e, tokens[0])
          }
        >
          <label htmlFor="token0">{symbols && symbols[0]} Amount</label>
          <input
            type="text"
            id="token0"
            placeholder="0.0000"
            //how is value working here?
            value={token1TransferAmount === 0 ? "" : token1TransferAmount}
            onChange={(e) => amountHandler(e, tokens[0])}
          />

          <button className="button" type="submit">
            {isDeposit ? <span>Deposit</span> : <span>Withdraw</span>}
          </button>
        </form>
      </div>

      <hr />

      {/* Deposit/Withdraw Component 2 (mETH) */}

      <div className="exchange__transfers--form">
        <div className="flex-between">
          <p>
            <small>Token</small>
            <br />
            <img src={eth} alt="Token Logo" />
            {symbols && symbols[1]}
          </p>
          <p>
            <small>Wallet</small>
            <br />
            {tokenBalances && tokenBalances[1]}
          </p>
          <p>
            <small>Exchange</small>
            <br />
            {exchangeBalances && exchangeBalances[1]}
          </p>
        </div>

        <form
          onSubmit={
            isDeposit
              ? (e) => depositHandler(e, tokens[1])
              : (e) => withdrawHandler(e, tokens[1])
          }
        >
          <label htmlFor="token1"></label>
          <input
            type="text"
            id="token2"
            placeholder="0.0000"
            value={token2TransferAmount === 0 ? "" : token2TransferAmount}
            onChange={(e) => amountHandler(e, tokens[1])}
          />

          <button className="button" type="submit">
            {isDeposit ? <span>Deposit</span> : <span>Withdraw</span>}
          </button>
        </form>
      </div>

      <hr />
    </div>
  );
};

export default Balance;
