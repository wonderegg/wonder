pragma solidity ^0.4.0;

import "./Ownable.sol";


contract CSBD is Ownable {

  struct CEDStruct {
    uint256 id;
    string cid;
    string fullname;
    string coursename;
    string issuedOn;
    string validUntil;
  } 

    CEDStruct[] public CEDStructArray;
    CEDStruct public CED;

    uint256 public CEDID =0 ;

  /* Define variable cert of the type string */
  string cert;

  /* This runs when the contract is executed */
  constructor () public {
    cert = "Certificed Senior Blockchain Program";
  }

  /* Main function */
  // CSBD - Certified Senior Blockchain Developer - Forked by George Gao from the version of "CBED20180201" created by Sean Xun Cao, some warning issues have been fixed for the latest compiler
  // "CBED20180201","Sean Xun Cao","Certified Blockchain Ethereum Developer","20180218","20280218"
  function setCED(string _cid, string _fullname,string _coursename,string _issuedOn,string _validUntil ) public onlyOwner {
        CEDID += 1;
        CED.id = CEDID;
        CED.cid = _cid;
        CED.fullname = _fullname;
        CED.coursename = _coursename;
        CED.issuedOn = _issuedOn;
        CED.validUntil = _validUntil;
        
        CEDStructArray.push(CED) -1;
    
  }

    function getCEDStructByID(uint256 i) constant public returns (uint256 , string , string ,string ,string ,string ) {
      if (i>0) {i = i-1;} 
        else { i =0 ;}
      return (CEDStructArray[i].id, CEDStructArray[i].cid,CEDStructArray[i].fullname,CEDStructArray[i].coursename,CEDStructArray[i].issuedOn, CEDStructArray[i].validUntil);
    }
 

    function getCEDStructsByCID(string _cid) constant public returns (uint256 , string , string ,string ,string ,string ) {
      for (uint256 i = (CEDStructArray.length-1); i >= 0  ; i--) {
          if ( keccak256(abi.encodePacked(_cid))==keccak256(abi.encodePacked(CEDStructArray[i].cid)) ) {
            return (CEDStructArray[i].id, CEDStructArray[i].cid,CEDStructArray[i].fullname,CEDStructArray[i].coursename,CEDStructArray[i].issuedOn, CEDStructArray[i].validUntil);
          }
      }    
    }


    function countCEDStruct() view public returns (uint256) {
        return CEDStructArray.length;
    }

  function getlastCED( ) constant public returns (uint256 _id, string _cid, string _fullname,string _coursename,string _issuedOn,string _validUntil) {
    return (CED.id, CED.cid,CED.fullname,CED.coursename,CED.issuedOn, CED.validUntil );
  }
}