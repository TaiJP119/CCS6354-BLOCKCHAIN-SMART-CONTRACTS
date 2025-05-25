// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdFund {
    //variables that store information for the contract:
    address public owner; //The person who creates this contract
    uint public goal; //How much money (in Wei) we want to raise.
    uint public deadline; //The time limit for the fundraising 
    uint public raisedAmount; //How much has been collected so far.
    uint public contributorCount; //How many people have contributed

    mapping(address => uint) public contributions;// to track how much gas each person sent by using their wallet address.
    
    bool public goalReached; //
    bool public withdrawn;
    //Events are messages the contract can "shout" to the outside world whenever something important happens. 
    event FundReceived(address contributor, uint amount); // message  of someone sent money.
    event GoalReached(uint totalAmount); // message of the fundraising target is met. 
    event Refunded(address contributor, uint amount); // message of getting the money back.

    //Only the contract creator (admin) can do this action. 
    modifier onlyOwner() { //
        require(msg.sender == owner, "Only owner can perform this");
        _;
    }

    // Only works if current time is before assigned deadline
    modifier beforeDeadline() {
        require(block.timestamp < deadline, "Deadline passed");
        _;
    }
    // Only works if current time is after assigned deadline
    modifier afterDeadline() {
        require(block.timestamp >= deadline, "Deadline not reached yet");
        _;
    }

    constructor(uint _goal, uint _durationMinutes) {
        owner = msg.sender; //Sets the creator as the owner. 
        goal = _goal * 1 ether; //Sets the fundraising goal
        deadline = block.timestamp + (_durationMinutes * 1 minutes); // deadline ( current time + how many minutes assigned). 
    }

    function contribute() public payable beforeDeadline {
        //set the minimum contributiton (at least 1 Wei )
        require(msg.value >= 1 ether, "Minimum contribution is 1 ETH");
        // new contributor, the counter goes up.
        if (contributions[msg.sender] == 0) {
            contributorCount++;
        }
        //add the contribution to the totals
        contributions[msg.sender] += msg.value;
        raisedAmount += msg.value;
        //emits a message for "FundReceived".  
        emit FundReceived(msg.sender, msg.value);
        //emits "GoalReached" if the goal is now reached, it .
        if (raisedAmount >= goal && !goalReached) {
            goalReached = true;
            emit GoalReached(raisedAmount);
        }
    }
    //everyone can call this to see "how much Ether is in the contract". 
    function checkBalance() public view returns (uint) {
        return address(this).balance;
    }
    //only (owner + after deadline + goal is met ) can call this
    function withdraw() public onlyOwner afterDeadline {
        require(goalReached, "Goal not reached");
        require(!withdrawn, "Already withdrawn"); //checks whether the owner has withdrawn the fund or not.(Must be false, which owner haven't withdrawn)

        withdrawn = true;
        payable(owner).transfer(address(this).balance); //send all the money in the contract to the owner’s address. 
    }

    //only (after deadline + goal is not met + user had contributed) can call this
    function refund() public afterDeadline {
        require(!goalReached, "Goal was reached, refund not possible");
        require(contributions[msg.sender] > 0, "No contributions found"); //check whether the account has actually contributed or not (MUST be True, which the user has contribute). 

        uint refundAmount = contributions[msg.sender]; 
        contributions[msg.sender] = 0; 
        payable(msg.sender).transfer(refundAmount);  //send back the user's contribution amount to the user.

        emit Refunded(msg.sender, refundAmount); //emits a "Refunded" event
    }

    // Anyone can call this to get all the main info about the contract in one call.(used for updating the UI) 
    function getDetails() public view returns (
        uint _goal,
        uint _deadline,
        uint _raisedAmount,
        uint _contributorCount,
        bool _goalReached,
        bool _withdrawn
    ) {
        return (goal, deadline, raisedAmount, contributorCount, goalReached, withdrawn);
    }
}
