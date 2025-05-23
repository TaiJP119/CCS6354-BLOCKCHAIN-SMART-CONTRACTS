// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdFund {
    address public owner;
    uint public goal;
    uint public deadline;
    uint public raisedAmount;
    uint public contributorCount;

    mapping(address => uint) public contributions;
    bool public goalReached;
    bool public withdrawn;

    event FundReceived(address contributor, uint amount);
    event GoalReached(uint totalAmount);
    event Refunded(address contributor, uint amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this");
        _;
    }

    modifier beforeDeadline() {
        require(block.timestamp < deadline, "Deadline passed");
        _;
    }

    modifier afterDeadline() {
        require(block.timestamp >= deadline, "Deadline not reached yet");
        _;
    }

    constructor(uint _goal, uint _durationMinutes) {
        owner = msg.sender;
        goal = _goal;
        deadline = block.timestamp + (_durationMinutes * 1 minutes);
    }

    function contribute() public payable beforeDeadline {
        require(msg.value >= 0.01 ether, "Minimum contribution is 0.01 ETH");

        if (contributions[msg.sender] == 0) {
            contributorCount++;
        }

        contributions[msg.sender] += msg.value;
        raisedAmount += msg.value;

        emit FundReceived(msg.sender, msg.value);

        if (raisedAmount >= goal && !goalReached) {
            goalReached = true;
            emit GoalReached(raisedAmount);
        }
    }

    function checkBalance() public view returns (uint) {
        return address(this).balance;
    }

    function withdraw() public onlyOwner afterDeadline {
        require(goalReached, "Goal not reached");
        require(!withdrawn, "Already withdrawn");

        withdrawn = true;
        payable(owner).transfer(address(this).balance);
    }

    function refund() public afterDeadline {
        require(!goalReached, "Goal was reached, refund not possible");
        require(contributions[msg.sender] > 0, "No contributions found");

        uint refundAmount = contributions[msg.sender];
        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(refundAmount);

        emit Refunded(msg.sender, refundAmount);
    }

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
