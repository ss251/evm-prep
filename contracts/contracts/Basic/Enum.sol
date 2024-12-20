// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
Solidity supports enums and they are useful to model choice and keep track of state.

Enums can be declared outside of a contract.
*/

contract Enum {
    // Enum representing shipping status
    enum Status {
        Pending,
        Shipping,
        Accepted,
        Rejected,
        Canceled
    }

    // Default value is the first element listed in
    // definition of the type, in this case "Pending"
    Status public status;

    // Returns uint
    // Pending - 0
    // Shipping - 1
    // Accepted - 2
    // Rejected - 3
    // Canceled - 4
    function get() public view returns (Status) {
        return status;
    }

    // Update status by passing uint into input
    function set(Status _status) public {
        status = _status;
    }

    // You can update to a sepcific enum like this
    function cancel() public {
        status = Status.Canceled;
    }

    // delete resets the enum to its first place, 0
    function reset() public {
        delete status;
    }
}
