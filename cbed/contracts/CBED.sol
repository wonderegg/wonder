/*.
This CBED Contract implements the standard functionality for recording the records of Certified Blockchain Ethereum Developers in a Blockchain.
.*/

pragma solidity ^0.4.20;


/* The contract of CBED */

contract CBED 
{

	/* The CBED Struct */
	struct CBEDStruct {
		uint256 id;  		//certificaton index id
		string cid;  		//certificaton id
		string fullname;	//Certified Blockchain Ethereum Developer's name
		string coursename;	//certified Blockchain course name 
		string issuedOn;	//certificaton issued date i.e. 20180228
		string validUntil;	//certificaton expire date i.e. 20280227
	} 

	CBEDStruct[] public CBEDStructArray;
	CBEDStruct public CED;

	uint256 public CEDID =0 ;

	/* Define variable cert of the type string */
	string cert;

	/* This runs when the contract is executed */
	function CBED() public {
		owner = msg.sender;
		cert = "Certificed Ethereum Program";
	}



	/* function for admin only */	
	function setCBED(string _cid, string _fullname,string _coursename,string _issuedOn,string _validUntil ) public {
	//?	if (msg.sender == isAdmin)  must check isAdmin first
		    CEDID += 1;
		    CED.id = CEDID;
		    CED.cid = _cid;
		    CED.fullname = _fullname;
		    CED.coursename = _coursename;
		    CED.issuedOn = _issuedOn;
		    CED.validUntil = _validUntil;
		    
		    CBEDStructArray.push(CED) -1;
	}


	function getCBEDStructByID(uint256 i) constant public returns (uint256 , string , string ,string ,string ,string ) {
	  if (i>0) {i = i-1;} 
	    else { i =0 ;}
	  return (CBEDStructArray[i].id, CBEDStructArray[i].cid,CBEDStructArray[i].fullname,CBEDStructArray[i].coursename,CBEDStructArray[i].issuedOn, CBEDStructArray[i].validUntil);
	}


	function getCBEDStructByCID(string _cid) constant public returns (uint256 , string , string ,string ,string ,string ) {
	  for (uint256 i = 0; i < CBEDStructArray.length ; i++) {
	      if ( keccak256(_cid)==keccak256(CBEDStructArray[i].cid) ) {
	        return (CBEDStructArray[i].id, CBEDStructArray[i].cid,CBEDStructArray[i].fullname,CBEDStructArray[i].coursename,CBEDStructArray[i].issuedOn, CBEDStructArray[i].validUntil);
	      }
	  }    
	}


	function countCBEDStruct() view public returns (uint256) {
	    return CBEDStructArray.length;
	}


	function getlastCED( ) constant public returns (uint256 _id, string _cid, string _fullname,string _coursename,string _issuedOn,string _validUntil) {
		return (CED.id, CED.cid,CED.fullname,CED.coursename,CED.issuedOn, CED.validUntil );

	}



	/* function destroy() for owner only to stop, pause the chain functions */
	function destroy() public {

		if (msg.sender == owner) 
			selfdestruct(owner);

	}




	/* CBED Administrator */

	/* The CBED Admin Struct */
	struct CBEDAdminStruct {
		uint256 adminId;  		//Admin index id
		string fullname;		//Admin name
		string lastLogin;		//last login time 
		string adminPermitStatus;	//Admin issueing cert permission activation ON/OFF
	} 

	CBEDAdminStruct[] public CBEDAdminStructArray;
	CBEDAdminStruct public CBEDAdmin;

	uint256 public CBEDAdminID =0 ;


	/* function addCBEDAdmin() for owner only */
	function addCBEDAdmin(string _adminFullname,string _adminPermitStatus ) public {
		if (msg.sender == owner) 
		    CBEDAdminID += 1;
		    CBEDAdmin.adminId = CBEDAdminID;
		    CBEDAdmin.fullname = _adminFullname;
		    CBEDAdmin.adminPermitStatus = _adminPermitStatus;
		    
		    CBEDAdminStructArray.push(CBEDAdmin) -1;
	}


	/* function activeCBEDAdminByAdminID() for owner only */
	function activeCBEDAdminByAdminID(string _adminId ) public {
		if (msg.sender == owner) 

		    //find admin and set adminPermitStatus = ON
		    CBEDAdminStructArray.push(CBEDAdmin) -1;
	}


	/* function deactiveCBEDAdminByAdminID() for owner only */
	function deactiveCBEDAdminByAdminID(string _adminId ) public {
		if (msg.sender == owner) 

		    //find admin and set adminPermitStatus = OFF
		    CBEDAdminStructArray.push(CBEDAdmin) -1;
	}


	/* function deleteCBEDAdminByAdminID() for owner only */
	function deleteCBEDAdminByAdminID(string _adminId ) public {
		if (msg.sender == owner) 

		    //find admin and delete it
		    CBEDAdminStructArray.pull(CBEDAdmin) -1;
	}


	/* function searchCBEDAdminByAdminID() for owner only */
	function searchCBEDAdminByAdminID(string _adminId ) public {
		if (msg.sender == owner) 

		//find admin by admin id
		if (i>0) {i = i-1;} 
		else { i =0 ;}
		return (CBEDAdminStructArray[i].adminId,CBEDAdminStructArray[i].fullname,CBEDAdminStructArray[i].lastLogin,CBEDAdminStructArray[i].adminPermitStatus);

	}


	/* function listCBEDAdmin() for owner only */
	function listCBEDAdmin() public {
		if (msg.sender == owner) 

		//find admin 
		if (i>0) {i = i-1;} 
		else { i =0 ;}
		return (CBEDAdminStructArray[i].id, CBEDAdminStructArray[i].cid,CBEDAdminStructArray[i].fullname,CBEDAdminStructArray[i].coursename,CBEDAdminStructArray[i].adminPermitStatus);

	}



}

