const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Token", function () { 
  let token, accounts, deployer, receiver, exchange;

  beforeEach(async () => {
    //fetch token from blockchain
    const Token = await ethers.getContractFactory("Token");
    //deploy is send data to constructor in token.sol
    token = await Token.deploy("Rakshit Lohchab", "RAPP", "1000000");

    //fetch balance using getSigners
    accounts = await ethers.getSigners();
    /*deployer islia h kyuki ye data return krta hai aur usma se 
    accounts ka array m 0th no pr deployer address hota hai */
    deployer = accounts[0];
    /*receiver islia h kyuki ye data return krta hai aur usma se 
    accounts ka array m 1th no pr receiver address hota hai */
    receiver = accounts[1];

    exchange = accounts[2];
  });

  //Describe deployment
  describe("Deployment", () => {

    //this is testing the name and stuff
    const name = "Rakshit Lohchab";
    const symbol = "RAPP";
    const decimals = "18";
    const totalSupply = tokens("1000000");

    it("has correct name", async () => {
      //read token name
      //check that name is correct
      expect(await token.name()).to.equal(name);
    });

    it("has a symmbol", async () => {
      //read token symbol
      //check that name is correct
      expect(await token.symbol()).to.equal(symbol);
    });

    it("has a decimals", async () => {
      //read token decimals
      //check that name is correct
      expect(await token.decimals()).to.equal(decimals);
    });

    it("has a total supply", async () => {
      //read token supply
      //check that name is correct
      expect(await token.totalSupply()).to.equal(totalSupply);
    });

    ////// deployer.adress ko hum totalSupply kyu kr rha hai bhul gaya main /////////////
    it("assign total supply to deployer", async () => {
      expect(await token.balanceOf(deployer.address)).to.equal(totalSupply);
    });
  });

  //describe sending
  describe("Sending Token", () => {
    let amount, transaction,result
    

    describe('Success', ()=>{

      beforeEach(async () => {
        //transfer token
        amount = tokens(100);
        transaction = await token
          .connect(deployer)
          .transfer(receiver.address, amount);
        result = await transaction.wait();
      });

      it("tranfers Token Balances", async () => {
        //ensure that the balance has changed
        expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900));
        expect(await token.balanceOf(receiver.address)).to.equal(amount);
      });

      it("emits a tranfer event", async () => {
        const event = result.events[0];
        // console.log(event);
        expect(event.event).to.equal("Transfer");

        const args = event.args;
        expect(args.from).to.equal(deployer.address);
        expect(args.to).to.equal(receiver.address);
        expect(args.value).to.equal(amount);
      });
    })

    describe('Failure', ()=>{
      it('rejects insufficient balances', async ()=>{
        //Transfer more token than deployer has to test the case - 10M tokens
        const invalidAmount = tokens(100000000);
        await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted

      })

      it("rejects invalid recipent", async () => {
        const amount = tokens(100);
        await expect(
          token
            .connect(deployer)
            .transfer("0x0000000000000000000000000000000000000000", amount)
        ).to.be.reverted;
      });


    })

  });

  //describe approve 
  describe('Approving Token', () => {
    let amount, transaction, result;

    beforeEach(async()=>{
      amount = tokens(100);
      transaction = await token.connect(deployer).approve(exchange.address, amount);
      result = await transaction.wait();
    })

    describe('Success', () => {
      it("allocates the allowance for token spending", async()=>{
        expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount)
      })

      it("emits a approval event", async () => {
        const event = result.events[0];
        // console.log(event);
        expect(event.event).to.equal("Approval");

        const args = event.args;
        expect(args.owner).to.equal(deployer.address);
        expect(args.spender).to.equal(exchange.address);
        expect(args.value).to.equal(amount);
      });

     })

     
    describe('Failure', () => { 
      it("rejects invalid spenders", async()=>{
        await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000',amount)).to.be.reverted
      })
    })

  });

  //describe use for approved token
  describe("Deligated Token Tranfers", ()=>{

    let amount, transaction, result;

    beforeEach(async () => {
      amount = tokens(100);
      transaction = await token
        .connect(deployer)
        .approve(exchange.address, amount);
      result = await transaction.wait();
    });

    describe("Success", () => {
      beforeEach(async () => {
        transaction = await token
        .connect(exchange)
        .transferFrom(deployer.address, receiver.address, amount);
        result = await transaction.wait();
      });

      it("transfers token balances", async () => {
        expect(await token.balanceOf(deployer.address)).to.be.equal(
          ethers.utils.parseUnits("999900", "ether")
        );
        expect(await token.balanceOf(receiver.address)).to.be.equal(amount);
      });

      it("resets the allowance value", async()=>{
        expect(await token
          .allowance(deployer.address, exchange.address))
          .to.be.equal(0);

      })

      it("emits a Transfer event", async () => {
        const event = result.events[0];
        // console.log(event);
        expect(event.event).to.equal("Transfer");

        const args = event.args;
        expect(args.from).to.equal(deployer.address);
        expect(args.to).to.equal(receiver.address);
        expect(args.value).to.equal(amount);
      });

    });

    describe("Failure", async () => {
      const invalidAmount = tokens(100000000)
      await expect(token.connect(exchange).transferFrom(deployer.address, receiver.address, invalidAmount))
      .to.be.reverted
    });

  });

});
