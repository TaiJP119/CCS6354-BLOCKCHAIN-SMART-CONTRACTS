// deposit > send > withdraw
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
// ^ interact with other version. compiler.
contract Funding {
    //immutable : cannot be changed any more.
    address private immutable owner;
    address[] private funders;

    //keep track money being stored inside contract itself
    uint256 private totalFunds;
    
    mapping(address => uint256) public userDeposits;

    function fund () public payable{ //payable: allow transaction happen inside this function.
        require((msg.value > 0), "Must deposit more than '1'"); //((if xxx), 'else')
        // checking whether the user exist or not. 'userDeposits[msg.sender]==0 ()'
        if(userDeposits[msg.sender]==0){
            funders.push(msg.sender);
        }
        userDeposits[msg.sender]+=msg.value;
        totalFunds += msg.value;
    }

    //onlyOwner
    modifier onlyOwner {
        require(msg.sender == owner, "Not owner"); 
        _;
    }

    constructor (address _owner){
        owner=_owner;
    }

    function withdraw() public onlyOwner{
        //same 
        // uint256 contractBalance = address(this).balance;
        uint256 contractBalance = totalFunds;

        require(contractBalance > 0 , "No funds in contract");
        for (uint256 i=0; i< funders.length; i++){
            userDeposits [funders[i]] = 0;

        }
        delete funders;
        totalFunds = 0;
        //reset first before doing payment
        payable(msg.sender).transfer(contractBalance);
    }

    function getBalance() public view returns (uint256){
        return totalFunds;
    }
//ether = RM / 
//Wei = SEN
}
