/*
This CBED Admin Contract inhireted from CBED Contract and implements the standard functionality for managing CBED Admins in the CBED Blockchain.
*/


import "./CBED.sol";

pragma solidity ^0.4.18;


/* The contract of CBEDAdmin */

contract CBEDAdmin is CBED {

    /* the CBED admin struct */
    struct cEDAdminStruct {
      uint256 adminId;          //Admin index id
      string fullname;          //Admin name
      //string lastLogin;         //last login time 
      bool adminPermitStatus;   //permission activation for Admin issueing cert to balockchain developer 
      address adminAddress;
 
    } 


    /* declaration of CBED admin to hold an instance of CBED admin*/
    cEDAdminStruct public cEDAdmin;

    /* declaration of CBED admin array to store CBED admin instances*/    
    cEDAdminStruct[] public cEDAdminStructArray;

    /* initial CBED admin ID for CBED admin*/
    uint256 public cEDAdminID =0 ;


    /* CBED Administration */



    /* set modifier for onlyAdmin */
    modifier onlyAdmin(address _adminAddress)  {
      //if find the admin set isAdmin=true, else isAdmin=false
      bool isAdmin = false;
      for (uint256 i = 0; i < cEDAdminStructArray.length ; i++) {
          if ( _adminAddress==cEDAdminStructArray[i].adminAddress ) {             
              
                isAdmin = true;
                         
          }
      }
      require(isAdmin);
      _;
    }


    /* set modifier for onlyAdminPermitStatusON */
    modifier onlyAdminPermitStatusON(address _adminAddress)  {
      //find admin set isAdminPermitStatus = true else false
      bool isAdminPermitStatus = false;
      for (uint256 i = 0; i < cEDAdminStructArray.length ; i++) {
          if ( _adminAddress==cEDAdminStructArray[i].adminAddress ) {             
              if (cEDAdminStructArray[i].adminPermitStatus==true) {
                isAdminPermitStatus = true;
              }             
          }
      }      
      require(isAdminPermitStatus);
      _;
    }


    /* function setCBED() will be for admin only  */
    function setCBED(string _cid, string _fullname,string _coursename,string _issuedOn,string _validUntil) onlyAdmin(msg.sender)  onlyAdminPermitStatusON(msg.sender) public  returns ( bool ) {
      CEDID += 1;
      CED.id = CEDID;
      CED.cid = _cid;
      CED.fullname = _fullname;
      CED.coursename = _coursename;
      CED.issuedOn = _issuedOn;
      CED.validUntil = _validUntil;      
      CBEDStructArray.push(CED) -1;
      return true;
    }
  

    /* function addcEDAdmin() for owner only */
    function addcEDAdmin(string _adminFullname,address _adminAddress ) onlyOwner public  returns ( bool ) {
      cEDAdminID += 1;
      cEDAdmin.adminId = cEDAdminID;
      cEDAdmin.fullname = _adminFullname;
           
      cEDAdmin.adminPermitStatus = true;    
      cEDAdmin.adminAddress = _adminAddress;

      cEDAdminStructArray.push(cEDAdmin) -1;
      return true;        
    }


    /* function activecEDAdminByAdminID() for owner only */
    function activecEDAdminByAdminID(uint256 _adminId ) onlyOwner public returns ( bool ) {        
      //find admin and set adminPermitStatus = true for the admin 
      for (uint256 i = 0; i < cEDAdminStructArray.length ; i++) {
          if ( _adminId==cEDAdminStructArray[i].adminId ) {      
              cEDAdminStructArray[i].adminPermitStatus = true;
              //set successful 
              return true;                        
          }
      }
      //not find and failed
      return false;      
    }


    /* function deactivecEDAdminByAdminID() for owner only */
    function deactivecEDAdminByAdminID(uint256 _adminId ) onlyOwner public  returns ( bool ) {        
      //find admin and set adminPermitStatus = false for the admin     
      for (uint256 i = 0; i < cEDAdminStructArray.length ; i++) {
          if ( _adminId==cEDAdminStructArray[i].adminId ) {      
              cEDAdminStructArray[i].adminPermitStatus = false;
              //deactivate successful
              return true;                        
          }
      }
      //not find and failed      
      return false;       
    }



    /* function searchcEDAdminByAdminID()  */
    function searchcEDAdminByAdminID(uint _adminId) view public returns (uint256,string,bool,address) {
        //find admin by admin id and return the admin 
        uint i = _adminId;
        if (i>0) {i = i-1;}
        else { i = 0;}
        return (cEDAdminStructArray[i].adminId,cEDAdminStructArray[i].fullname,cEDAdminStructArray[i].adminPermitStatus,cEDAdminStructArray[i].adminAddress);
    }


    /* function getLastcEDAdmin()  cEDAdmin*/
    function getLastcEDAdmin()  view public returns (uint256,string,bool,address ) { 
      //find last and return admin
     
          return (cEDAdmin.adminId,cEDAdmin.fullname,cEDAdmin.adminPermitStatus,cEDAdmin.adminAddress);

    }


}
