// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGho {
    function transferFrom (
        address from,
        address to,
        uint256 amount
    ) external;
    
    function transfer (
        address to,
        uint256 amount
    ) external;
}