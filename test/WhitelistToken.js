const assertJump = require('./assertJump');
var WhitelistToken = artifacts.require("../contracts/WhitelistToken.sol");
var TokenHolder = artifacts.require("../contracts/TokenHolder.sol");

contract('WhitelistToken', function(accounts) {
  var token;
  var holder;
  var owner = accounts[0];
  var account_one = accounts[1];
  var account_two = accounts[2];
  
  beforeEach(async function() {
    token = await WhitelistToken.new(owner, 100);
    holder = await TokenHolder.new(token.address, {from: account_one});
  });
  
  it("should return the correct totalSupply after construction", async function() {
    let totalSupply = await token.totalSupply();
    assert.equal(totalSupply, 100);
  });

  it("should allow call to transfer() from a whitelisted account", async function() {
    let transferOne = await token.transfer(account_one, 50);
    await token.enableWhitelist(account_one);
    let transferTwo = await token.transfer(account_two, 40, {from: account_one});

    let accountOneBalance = await token.balanceOf(account_one);
    assert.equal(accountOneBalance, 10);

    let accountTwoBalance = await token.balanceOf(account_two);
    assert.equal(accountTwoBalance, 40);
  });
  
  it("should throw an error when calling transfer() from non-whitelisted account", async function() {
    let transferOne = await token.transfer(account_one, 50);
    try {
      let transfer = await token.transfer(account_two, 50, {from: account_one});
    } catch(error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it("should throw an error when calling balanceOf() from non-whitelisted account", async function() {
    let transferOne = await token.transfer(account_one, 50);
    try {
      let balance = await token.balanceOf(account_one, {from: account_one});
    } catch(error) {
      return assertJump(error);
    }
    assert.fail('should have thrown before');
  });

  it("should match token.address with contract's tokenAddress", async function() {
    let holderTokenAddr = await holder.tokenAddress();
    assert.equal(token.address, holderTokenAddr);
  });

  it("should have correct balance after transfer", async function() {
    await token.enableWhitelist(holder.address);
    await token.transfer(holder.address, 50);
    let holderBalance = await token.balanceOf(holder.address);
    let holderContractBal = await holder.bal();
    assert.equal(holderBalance.toNumber(), holderContractBal.toNumber());
  });

  it("should allow transfer of funds from whitelisted contract", async function() {
    await token.enableWhitelist(holder.address);
    await token.transfer(holder.address, 50);
    await holder.transferToken(owner, 15, {from: account_one});
    let ownerBal = await token.balanceOf(owner);
    let holderBal = await token.balanceOf(holder.address);
    assert.equal(ownerBal.toNumber() - 15, holderBal.toNumber() + 15);
  });
});

