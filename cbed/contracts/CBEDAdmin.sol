/*
This CBED Admin Contract inhireted from CBED and implements the standard functionality for managing CBED Admins in the CBED Blockchain.
*/


import "./CBED.sol";

pragma solidity ^0.4.18;


/* The contract of CBEDAdmin */

contract CBEDAdmin is CBED {

    /* the CBED admin struct */
    struct cEDAdminStruct {
      uint256 adminId;          //Admin index id
      string fullname;          //Admin name
      string lastLogin;         //last login time 
      bool adminPermitStatus; //permission activation for Admin issueing cert to balockchain developer 
    } 


    /* declaration of CBED admin to hold an instance of CBED admin*/
    cEDAdminStruct public cEDAdmin;

    /* declaration of CBED admin array to store CBED admin instances*/    
    cEDAdminStruct[] public cEDAdminStructArray;

    /* initial CBED admin ID for CBED admin*/
    uint256 public cEDAdminID =0 ;


    /* CBED Administration */

    /* function addcEDAdmin() for owner only */
    function addcEDAdmin(string _adminFullname,bool _adminPermitStatus ) onlyOwner public {
        cEDAdminID += 1;
        cEDAdmin.adminId = cEDAdminID;
        cEDAdmin.fullname = _adminFullname;
        cEDAdmin.adminPermitStatus = _adminPermitStatus;  //default is true          
        cEDAdminStructArray.push(cEDAdmin) -1;
    }


    /* function activecEDAdminByAdminID() for owner only */
    function activecEDAdminByAdminID(string _adminId ) onlyOwner public {
        
      //find admin and set adminPermitStatus = true for the admin (will add steps for active)
      bool isAdminPermitStatus = true;
      _adminId ="";
      
    }


    /* function deactivecEDAdminByAdminID() for owner only */
    function deactivecEDAdminByAdminID(string _adminId ) onlyOwner public {
        
      //find admin and set adminPermitStatus = false for the admin (will add steps for deactive)
      bool isAdminPermitStatus = false;      
      _adminId ="";     
      
    }


    /* function deletecEDAdminByAdminID() for owner only */
    function deletecEDAdminByAdminID(string _adminId ) onlyOwner public {
        
      //find admin and delete it (will add steps for searching and deleting)
      _adminId ="";      

    }


    /* function searchcEDAdminByAdminID()  */
    function searchcEDAdminByAdminID(string _adminId ) constant public returns ( string ) {
        
      //find admin by admin id and return the admin (will add steps for searching)
      _adminId ="";      
      return ;
    }


    /* function listcEDAdmin()  */
    function listcEDAdmin()  constant public returns ( string ) { 
        
      //find admin list and return all admins  (will add steps for listing)

      return ;    

      /*if (uint256 i>0) {i = i-1;} //example for find and return cbed admin list
      else { i =0 ;}
      return (cEDAdminStructArray[i].id, cEDAdminStructArray[i].cid,cEDAdminStructArray[i].fullname,cEDAdminStructArray[i].coursename,cEDAdminStructArray[i].adminPermitStatus);
      */
    }


    /* set modifier for onlyAdmin */
    modifier onlyAdmin(string _adminId)  {

      //find admin by admin id and return the admin (will add steps for searching)
      //if find set isAdmin=true, elst set isAdmin=false
      bool isAdmin = true;
      require(isAdmin);
      return ;
      _;
    }


    /* set modifier for onlyAdminPermitStatusON */
    modifier onlyAdminPermitStatusON(string _adminId)  {

      //find admin by admin id and return the admin permit status (will add steps for searching)
      //if ON set isAdminPermitStatus=true, elst set isAdminPermitStatus=false
      bool isAdminPermitStatus = true;
      require(isAdminPermitStatus);
      return ;
      _;
    }


    //we may not need login function now but keep as comments here for reference
    /* function CBEDAdminLogin() will be for admin only  
    function CBEDAdminLogin(string _adminId,string _fullname) onlyAdmin( _adminId) public {
    ////still have some thing need to be discussed about login function ???? 
    ////maybe we don't need login function but need check onlyAdmin for each admin function. ???
      return ; 
    }*/


    /* function setCBED() will be for admin only  */
    function setCBED(string _adminId,string _cid, string _fullname,string _coursename,string _issuedOn,string _validUntil ) onlyAdmin( _adminId) onlyAdminPermitStatusON( _adminId) public {
    //must check if (isAdmin) 
    //must check if (onlyAdminPermitStatus=ON)
      CEDID += 1;
      CED.id = CEDID;
      CED.cid = _cid;
      CED.fullname = _fullname;
      CED.coursename = _coursename;
      CED.issuedOn = _issuedOn;
      CED.validUntil = _validUntil;      
      CBEDStructArray.push(CED) -1;
    }
  

}