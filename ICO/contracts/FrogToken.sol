pragma solidity ^0.4.18;

import "./MintableToken.sol";
import "./BurnableToken.sol";

contract FrogToken is MintableToken, BurnableToken {

    string public constant name = "Frog";
    string public constant symbol = "FROG";
    uint32 public constant decimals = 18;

    function FrogToken() public {
        totalSupply = 400000000E18;
        balances[owner] = totalSupply; // Add all tokens to issuer balance (crowdsale in this case)
    }

}
