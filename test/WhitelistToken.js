const assertJump = require('./assertJump');
var WhitelistToken = artifacts.require("../contracts/WhitelistToken.sol");

contract('WhitelistToken', function(accounts) {
  var token;
  var owner = accounts[0];
  var account_one = accounts[1];
  var account_two = accounts[2];
  
  beforeEach(async function() {
    token = await WhitelistToken.new(owner, 100);
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

});

