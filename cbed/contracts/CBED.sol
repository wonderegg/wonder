/*
This CBED Contract implements the standard functionality for recording the records of Certified Blockchain Ethereum Developers in a Blockchain.
*/

pragma solidity ^0.4.18;


/* The contract of CBED */

contract CBED {

	/* owner address */
    address public owner;


    /* set modifier for onlyOwner */
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }


    /* function transfer to new owner for onlyOwner */
    function transferOwnership(address newOwner) onlyOwner public {
        owner = newOwner;
    }


	/* function destroy for onlyowner to stop and pause the chain functions */
	function destroy() onlyOwner public {
		selfdestruct(owner);
	}


	/* the CBED struct defines CBED elements */
	struct CBEDStruct {
		uint256 id;  		//certificaton index id
		string cid;  		//certificaton id
		string fullname;	//Certified Blockchain Ethereum Developer's name
		string coursename;	//certified Blockchain course name 
		string issuedOn;	//certificaton issued date, i.e. 20180228
		string validUntil;	//certificaton expire date, i.e. 20280227
	} 


	/* declaration of CBED to hold an instance of CBED*/
	CBEDStruct public CED; 

	/* declaration of CBED array to store CBED instances*/
	CBEDStruct[] public CBEDStructArray; 

	/* initial CBEDID for CBED */
	uint256 public CEDID = 0 ;

	/* Define variable cert of the type string */
	string cert;


	/* This runs when the contract is executed */
	function CBED() public {
		owner = msg.sender;  //set owner
		cert = "Certificed Ethereum Program";  //set cert value
	}


    /* function getCBEDStructByID() for getting a cert by index id */
	function getCBEDStructByID(uint256 i) constant public returns (uint256 , string , string ,string ,string ,string ) {
	  if (i>0) {i = i-1;} 
	    else { i =0 ;}
	  return (CBEDStructArray[i].id, CBEDStructArray[i].cid,CBEDStructArray[i].fullname,CBEDStructArray[i].coursename,CBEDStructArray[i].issuedOn, CBEDStructArray[i].validUntil);
	}


    /* function getCBEDStructByCID() for getting a cert by certified developer id */
	function getCBEDStructByCID(string _cid) constant public returns (uint256 , string , string ,string ,string ,string ) {
	  for (uint256 i = 0; i < CBEDStructArray.length ; i++) {
	      if ( keccak256(_cid)==keccak256(CBEDStructArray[i].cid) ) {
	        return (CBEDStructArray[i].id, CBEDStructArray[i].cid,CBEDStructArray[i].fullname,CBEDStructArray[i].coursename,CBEDStructArray[i].issuedOn, CBEDStructArray[i].validUntil);
	      }
	  }    
	}


    /* function countCBEDStruct() for calculating certified developer numbers in the CBED blockchain */
	function countCBEDStruct() view public returns (uint256) {
	    return CBEDStructArray.length;
	}


    /* function getlastCBED() for getting the last certified developer cert in the CBED blockchain */
	function getlastCBED( ) constant public returns (uint256 _id, string _cid, string _fullname,string _coursename,string _issuedOn,string _validUntil) {
		return (CED.id, CED.cid,CED.fullname,CED.coursename,CED.issuedOn, CED.validUntil );

	}



}

