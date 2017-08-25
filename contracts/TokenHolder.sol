pragma solidity ^0.4.11;

import './WhitelistToken.sol';

contract TokenHolder {

  struct Ledger {
    address recipient;
    uint256 amount;
    uint256 balance;
  }

  address public tokenAddress;
  address public owner;
  uint256 public currentBalance;
  uint lastId = 0;
  
  mapping(uint => Ledger) transactions;

  function TokenHolder(address _tokenAddr) {
    owner = msg.sender;
    tokenAddress = _tokenAddr;
  }


  function bal() external constant returns (uint256 balance) {
    return WhitelistToken(tokenAddress).holderBalance();
  }
  
  function transferToken(address _to, uint256 _amount) external {
    currentBalance = WhitelistToken(tokenAddress).holderBalance();
    require(currentBalance >= _amount);
    WhitelistToken(tokenAddress).transfer(_to, _amount);
    uint txId = lastId++;
    transactions[txId] = Ledger(_to, _amount, currentBalance - _amount);
  }
}
