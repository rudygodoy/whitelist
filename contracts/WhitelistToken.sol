pragma solidity ^0.4.11;

import "./ERC20Basic.sol";
import './SafeMath.sol';

contract WhitelistToken is ERC20Basic {
  using SafeMath for uint256;

  mapping(address => uint256) balances;
  mapping(address => bool) whitelist;

  modifier onlyWhitelist() {
    require(whitelist[msg.sender] == true);
    _;
  }

  function WhitelistToken(address initialAccount, uint initialBalance) {
    if(initialAccount == 0x0) {
      initialAccount = msg.sender;
    }    
    balances[initialAccount] = initialBalance;
    totalSupply = initialBalance;
    enableWhitelist(msg.sender);
  }

  
  function enableWhitelist(address _address) {
    whitelist[_address] = true;
  }

  function disableWhitelist(address _address){
    whitelist[_address] = false;
  }

  function transfer(address _to, uint256 _value) onlyWhitelist {
    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);
    Transfer(msg.sender, _to, _value);
  }

  function balanceOf(address _owner) onlyWhitelist constant returns (uint256 balance) {
    return balances[_owner];
  }

  function holderBalance() onlyWhitelist external constant returns (uint256 balance) {
    return balanceOf(msg.sender);
  }  
}
