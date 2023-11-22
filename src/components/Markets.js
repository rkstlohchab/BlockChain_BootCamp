import { useSelector, useDispatch } from 'react-redux'

import config from '../config.json'

import { loadTokens } from '../store/interactions'

const Markets = () => {
  const provider = useSelector((state) => state.provider.connection);
  const chainId = useSelector((state) => state.provider.chainId);

  const dispatch = useDispatch();

  
  const marketHandler = async (e) => {
    loadTokens(provider, e.target.value.split(","), dispatch);
  };

  return (
    <div className="component exchange__markets">
      <div className="component__header">
        <h2>Select Market</h2>
      </div>
      {/* here we are using chainId && because we want to check if the chainId is
      true then we will use the config[chainId] and if it is false then we will
      not use the config[chainId]

      we did not use async await here because
      we are not fetching we are rendering the data and while rendering the data
      we dont need to use async await  */}
      {chainId && config[chainId] ? (
        <select name="markets" id="markets" onChange={marketHandler}>
          <option
            value={`${config[chainId].RAPP.address},${config[chainId].mETH.address}`}
          >
            RAPP / mETH
          </option>
          <option
            value={`${config[chainId].RAPP.address},${config[chainId].mDAI.address}`}
          >
            RAPP / mDAI
          </option>
        </select>
      ) : (
        <div>
          <p>Not Deployed to Network</p>
        </div>
      )}
      <hr />
    </div>
  );
}

export default Markets;
