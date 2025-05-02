//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract HelloWorld {
    string public greeting = "Hello, World of Blockchain";
    function setKeys(string memory _greeting) public{
            greeting = _greeting;
        }
function getKeys() public view returns (string memory){
    return (greeting);
}
}
