// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
You can import local and external files in Solidity.

Local
Here is our folder structure.

├── Import.sol
└── Foo.sol
*/

struct Point {
    uint256 x;
    uint256 y;
}

error Unauthorized(address caller);

function add(uint256 x, uint256 y) pure returns (uint256) {
    return x + y;
}

contract Foo {
    string public name = "Foo";
}