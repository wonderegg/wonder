pragma solidity ^0.4.18;

import "./WonderToken.sol";
import "./ConvertLib.sol";

contract WonderEgg is WonderToken{
    
  struct WonderStruct {
    address addr;
    uint256 id;
    uint256 wprice;
    bytes32 idName;
    uint256 Description;
  } 

    WonderStruct[] public WonderStructArray;
    WonderStruct public wonder;

    mapping (address => WonderStruct) wonders;
    mapping (address => uint) balances;

    address[] public wonderAddressArray;
    
    uint256 public wonderID =0 ;

    event wonderInfo(
        address addr,
        uint256 id,
        uint256 wprice,
        bytes32 idName,
        uint256 Description
    ) ;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
      if (balances[msg.sender] < amount) return false;
      balances[msg.sender] -= amount;
      balances[receiver] += amount;
      Transfer(msg.sender, receiver, amount);
      return true;
    }

    function WonderEgg() WonderToken(21000000,"WonderCoin","WDR") payable public {
        owner = msg.sender;
        balances[tx.origin] = 100000;
    }
    
    function setWonderStruct(address _address, uint256 _wprice, bytes32 _idName, uint256 _Description) public {

        wonder = wonders[_address];
        wonderID += 1;
        wonder.addr = _address;
        wonder.id = wonderID;
        wonder.wprice = _wprice;
        wonder.idName = _idName;
        wonder.Description = _Description;
        
        wonderAddressArray.push(_address) -1;
        
        WonderStructArray.push(wonder) -1;
        wonderInfo(_address,wonderID, _wprice, _idName, _Description) ;
        
    }

    function getWonderStructs() view public returns (address[]) {
            return (wonderAddressArray); 
    }

    function getWonderStructByID(uint256 i) view public returns (address, uint256 , uint256 , bytes32 , uint256) {
      return (WonderStructArray[i].addr,WonderStructArray[i].id, WonderStructArray[i].wprice, WonderStructArray[i].idName, WonderStructArray[i].Description);
    }

    function getWonderStructByAddress(uint256 i, address ins) view public returns (address, uint256 , uint256 , bytes32 , uint256) {

        if (ins == WonderStructArray[i].addr){
            return (WonderStructArray[i].addr,WonderStructArray[i].id, WonderStructArray[i].wprice, WonderStructArray[i].idName, WonderStructArray[i].Description);
        }
        
    }


    function getlastWonderStruct() view public returns (address, uint256 , uint256 , bytes32 , uint256) {
            return (wonder.addr,wonder.id,wonder.wprice,wonder.idName,wonder.Description  );
    }

    function countWonderStructs() view public returns (uint256) {
        return wonderAddressArray.length;
    }
    
}
