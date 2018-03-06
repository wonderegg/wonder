pragma solidity ^0.4.18;

import "./MintableToken.sol";
import "./BurnableToken.sol";

contract WonderToken is MintableToken, BurnableToken {

    string public constant name = "Wonder";
    string public constant symbol = "WONDER";
    uint32 public constant decimals = 14;

    function WonderToken() public {
        totalSupply = 400000000E14;
        balances[owner] = totalSupply; // Add all tokens to issuer balance (crowdsale in this case)
    }

}
