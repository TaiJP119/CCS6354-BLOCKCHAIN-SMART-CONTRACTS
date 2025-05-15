// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title SimpleContract – starter example for Lab 6 (owner‑only counter + deposits)
contract SimpleContract {

    // ──────────── State ────────────
    address public owner;          // Owner of the contract (set once in constructor)
    uint    public count;          // Simple counter variable
    mapping(address => uint) public balances;  // Tracks each user’s deposited Ether

    // ───────── Constructor ─────────
    constructor() {
        owner = msg.sender;        // Deployer becomes the owner
    }

    // ──────── Modifier ────────
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    // ──────────── Logic ────────────

    /// Owner can set any value for `count`
    function setCount(uint _count) public onlyOwner {
        count = _count;
    }

    /// Anyone can read the current counter
    function getCount() public view returns (uint) {
        return count;
    }

    /// Anyone can deposit Ether; value is added to their balance
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    /// Read the deposited balance of a given address
    function checkBalance(address _user) public view returns (uint) {
        return balances[_user];
    }

    /// Withdraw up to the caller’s own deposited amount
    function withdraw(uint _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
    }

    // Add a resetCount() function that only the owner can call.
    function resetCount() public onlyOwner{
        count = 0;
    }
    // Implement transferBetween(address to, uint amount) so users can send deposits to each other without withdrawing.
    function transferBetween(address to, uint amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance to transfer");
        require(to != address(0), "Invalid recipient address");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

}
 