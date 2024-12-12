// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/* Here is a simple contract that you can get, increment and decrement the count stored in this contract. */

contract Counter {
    uint256 public count;

    function get() public view returns (uint256) {
        return count;
    }

    function inc() public {
        count += 1;
    }

    function dec() public {
        count -= 1;
    }
}