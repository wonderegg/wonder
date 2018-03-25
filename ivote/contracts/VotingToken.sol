/*
This Token Contract implements the standard token functionality (https://github.com/ethereum/EIPs/issues/20) as well as the following OPTIONAL extras intended for use by humans.

In other words. This is intended for deployment in something like a Token Factory or Mist wallet, and then used by humans.
Imagine coins, currencies, shares, voting weight, etc.
Machine-based, rapid creation of many tokens would not necessarily need these extra features or will be minted in other manners.

1) Initial Finite Supply (upon creation one specifies how much is minted).
2) In the absence of a token registry: Optional Decimal, Symbol & Name.
3) Optional approveAndCall() functionality to notify a contract if an approval() has occurred.

.*/

import "./StandardToken.sol";

pragma solidity ^0.4.8;

contract VotingToken is StandardToken {
    
    //make all state variables public for display and testing 
    
    //the address that creates the contract and owns all the tokens initially
    address public contractOwnerAddr;
    
    /* just use candidate index to store the voter choice. But since the uint8 defaults to 0, 
    and array index starting with 0, cannot use the 0 array item to store anything,
    the first candidate name will NOT be used, use a placeholder for it.
    */
    //candidate name array. 
    bytes32[] public candidateNames;
    //mapping of candidate index in the array above to the name
    //mapping (uint8 => bytes32) candidateIndexToNameMapping;
    // mapping of canddate index to votes received 
    mapping (uint8 => uint8) public candToVotesRcvdMapping;
    // mapping of registered voters, each voter (one address) can only register once 
    mapping (address => bytes32) public voterAddrToNameMapping;
    address[] public voterAddrRegisteredArray;
    //mapping of voters to correponding voted candidate index, each voter can only vote once.
    mapping (address => uint8) public voterAddrToVotedCandIdxMapping;

    

    /* 
    get all the candidate names in an array
    */
    function getAllCandidates() view public returns (bytes32[]) {
        return candidateNames;
    }

    /* 
    get all the registered voter names in an array
    */
    function getAllRegVoters() view public returns (address[]) {
        return voterAddrRegisteredArray;
    }

    /*
    When a user register as a voter, check that the user has not registered then register by 
    1. Saving the user the voterAddrToNameMapping
    2. Sending a token to the user.  User can know registration is successful by checking the token received
    */
    function voterRegister(address voteraddr, bytes32 voterName) public returns (bool success) {
        //make sure there is enough tokens left
        require(balances[contractOwnerAddr] >= 1);

        //check the user has not been resgisterd before, then register
        bytes32 bDefault;  //default value
        require(voterAddrToNameMapping[voteraddr] == bDefault);
        voterAddrToNameMapping[voteraddr] = voterName;
        voterAddrRegisteredArray.push(voteraddr);
        
        balances[contractOwnerAddr] -= 1;
        balances[voteraddr] += 1;

        Transfer(contractOwnerAddr, voteraddr, 1);
        return true;
    }
    
    /*
    When a voter votes for a candidate,
    1. Check the voter has not voted before, i.e. no voting record exists in the voterAddrToVotedCandIdxMapping.
    2. Check the voter has regsitered, i.e. has a token 
    3. If all pass, record the voter's vote by recording the vote and taking the token from the voter.
    */
    function votersVote(address voteraddr, uint8 candIdx) public returns (bool success) {
        //check the voter has not voted yet.
        require(voterAddrToVotedCandIdxMapping[voteraddr] == 0);
        //chekc the voter has registered and has a token not used.
         bytes32 bDefault;  //default value
        require(voterAddrToNameMapping[voteraddr] != bDefault);
        require(balances[voteraddr] > 0);
        //check the cand idx is valid.
        require(candIdx > 0 && candIdx < candidateNames.length);
        
        //record the vote
        voterAddrToVotedCandIdxMapping[voteraddr] = candIdx;
        candToVotesRcvdMapping[candIdx] += 1;  //increase one vote 
        
        //take away the token
        balances[voteraddr] -= 1;
        balances[contractOwnerAddr] += 1;
        Transfer(voteraddr, contractOwnerAddr, 1);
        
        return true;
    }

    /* Public variables of the token */

    /*
    NOTE:
    The following variables are OPTIONAL vanities. One does not have to include them.
    They allow one to customise the token contract & in no way influences the core functionality.
    Some wallets/interfaces might not even bother to look at this information.
    */
    string public name;                   //fancy name: eg Simon Bucks
    //should only allow 0 for ballot tokens 
    uint8 public decimals = 0;                //How many decimals to show. ie. There could 1000 base units with 3 decimals. Meaning 0.980 SBX = 980 base units. It's like comparing 1 wei to 1 ether.
    string public symbol;                 //An identifier: eg SBX
    string public version = 'H0.1';       //human 0.1 standard. Just an arbitrary versioning scheme.

     function VotingToken(
        uint256 _initialAmount,
        string _tokenName,
        // uint8 _decimalUnits,  
        string _tokenSymbol,
        bytes32[] candidateNamesIn   //note the first one must be a placeholder
        ) public {
        contractOwnerAddr = msg.sender;             //save the contract owner aaddress
        balances[msg.sender] = _initialAmount;               // Give the creator all initial tokens, determining allowed voter number
        totalSupply = _initialAmount;                        // Update total supply
        name = _tokenName;                                   // Set the name for display purposes
        //decimals = _decimalUnits;                          // Amount of decimals for display purposes
        symbol = _tokenSymbol;                               // Set the symbol for display purposes
        candidateNames = candidateNamesIn;                    //set the candidate names by the input names 
    }
    
    /*
    overwrite the function in the StandardToken to remove the allowance requirement
    
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        //same as above. Replace this line with the following if you want to protect against wrapping uints.
        //require(balances[_from] >= _value && allowed[_from][msg.sender] >= _value && balances[_to] + _value > balances[_to]);
        //uint256 allowance = allowed[_from][msg.sender];
        //require(balances[_from] >= _value && allowance >= _value);
        require(balances[_from] >= _value);
        balances[_to] += _value;
        balances[_from] -= _value;
        //if (allowance < MAX_UINT256) {
        //    allowed[_from][msg.sender] -= _value;
        //}
        Transfer(_from, _to, _value);
        return true;
    }
    */


    /* Approves and then calls the receiving contract 
    function approveAndCall(address _spender, uint256 _value, bytes _extraData) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);

        //call the receiveApproval function on the contract you want to be notified. This crafts the function signature manually so one doesn't have to include a contract in here just for this.
        //receiveApproval(address _from, uint256 _value, address _tokenContract, bytes _extraData)
        //it is assumed when one does this that the call *should* succeed, otherwise one would use vanilla approve instead.
        require(_spender.call(bytes4(bytes32(keccak256("receiveApproval(address,uint256,address,bytes)"))), msg.sender, _value, this, _extraData));
        return true;
    }
    */
    

}

