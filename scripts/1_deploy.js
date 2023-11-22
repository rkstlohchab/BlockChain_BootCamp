const { ethers } = require("hardhat");

async function main() {
  console.log('Preparing deployment\n')


  //fetch contract to deploy
  const Token = await ethers.getContractFactory("Token");
  const Exchange = await ethers.getContractFactory("Exchange");

  //fetch accounts
  const accounts = await ethers.getSigners()
  console.log(`Accounts fetched: \n${accounts[0].address}\n${accounts[1].address}\n`)

  //deploy contract
  const RAPP = await Token.deploy('Rakshit', 'RAPP', '1000000');
  await RAPP.deployed()
  console.log(`RAPP deployed to : ${RAPP.address}`)

  const mDAI = await Token.deploy("mDai", "mDai", "1000000");
  await mDAI.deployed();
  console.log(`mDai deployed to : ${mDAI.address}`);
  
  const mETH = await Token.deploy("mETH", "mETH", "1000000");
  await mETH.deployed();
  console.log(`mETH deployed to : ${mETH.address}`);

  const exchange = await Exchange.deploy(accounts[1].address, 10)
  await exchange.deployed();
  console.log(`Exchange Deployed to: ${exchange.address}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
