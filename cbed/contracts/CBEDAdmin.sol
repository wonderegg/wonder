import "./CBED.sol";

pragma solidity ^0.4.20;


contract CBEDAdmin is CBED {

  struct CBEDAdminStruct {
    uint256 id;
    string cid;
    string fullname;
    string coursename;
    string issuedOn;
    string validUntil;
  } 

    CBEDAdminStruct[] public CEDStructArray;
    CBEDAdminStruct public CED;

    uint256 public CEDID =0 ;

  /* Define variable cert of the type string */
  string cert;

  /* This runs when the contract is executed */
  function CBEDAdmin() public {
    cert = "Certificed Ethereum Program";
  }

  /* Main function */
  // "CBED20180201","Sean Xun Cao","Certified Blockchain Ethereum Developer","20180218","20280218"
  function setCED(string _cid, string _fullname,string _coursename,string _issuedOn,string _validUntil ) public {
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
      for (uint256 i = 0; i < CEDStructArray.length ; i++) {
          if ( keccak256(_cid)==keccak256(CEDStructArray[i].cid) ) {
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