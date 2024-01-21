// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "contracts/IGho.sol";

contract lfgho is Ownable {
    address public ghoAddress;
    address public __owner;

    mapping (address => string) private upiId;


    constructor(address initialOwner, address _ghoAddress)
        Ownable(initialOwner)
    {
        __owner = initialOwner;
        ghoAddress = _ghoAddress;
    }

    function getUpi(address account) public view onlyOwner returns (string memory) {
        return upiId[account];
    }

    function setupiId(address account, string memory upi) public onlyOwner {
        upiId[account] = upi;
        
    }

    function sendGho(
        address _from,
        address _to,
        uint256 amount
    ) public onlyOwner {
        IGho ghoToken = IGho(ghoAddress);
        ghoToken.transferFrom(_from, _to, amount);
    }
    function sendSelf(address _from, uint256 amount) public onlyOwner{
        IGho ghoToken = IGho(ghoAddress);
        ghoToken.transferFrom(_from, address(this), amount);
    }

    function __withdraw(uint256 amount) public onlyOwner {
        IGho ghoToken = IGho(ghoAddress);
        ghoToken.transfer(__owner, amount);
    }
}
