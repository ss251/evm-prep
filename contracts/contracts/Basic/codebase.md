# Array.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// Array can have a compile-time fixed size or a dynamic size.

contract Array {
    // Several ways to initialize an array
    uint256[] public arr;
    uint256[] public arr2 = [1, 2, 3];
    // Fixed sized array, all elements intialize to 0
    uint256[10] public myFixedSizeArr;

    function get(uint256 i) public view returns (uint256) {
        return arr[i];
    }

    // Solidity can return the entire array
    // But this function should be avoided for
    // arrays that can grow indefinitely in length.
    // memory required for dynamically sized types (arrays, strings, etc.)
    function getArr() public view returns (uint256[] memory) {
        return arr;
    }

    function push(uint256 i) public {
        // Append to array
        // This will increase the array length by 1.
        arr.push(i);
    }

    function pop() public {
        // Remove last element from array
        // This will decrease the array length by 1
        arr.pop();
    }

    function getLength() public view returns (uint256) {
        return arr.length;
    }

    function remove(uint256 index) public {
        // Delete does not change the array length.
        // It resets the value at index to its default value,
        // in this case 0
        delete arr[index];
    }

    function examples() external pure {
        // create array in memory, only fixed size can be created
        uint256[] memory a = new uint256[](5);
    }
}

// Remove array element by shifting elements from right to left

contract ArrayRemoveByShifting {
    // [1, 2, 3] -- remove(1) --> [1, 3, 3] --> [1, 3]
    // [1, 2, 3, 4, 5, 6] -- remove(2) --> [1, 2, 4, 5, 6, 6] --> [1, 2, 4, 5, 6]
    // [1, 2, 3, 4, 5, 6] -- remove(0) --> [2, 3, 4, 5, 6, 6] --> [2, 3, 4, 5, 6]
    // [1] -- remove(0) --> [1] --> []

    uint256[] public arr;

    function remove(uint256 _index) public {
        require(_index < arr.length, "index out of bound");

        for (uint256 i = _index; i < arr.length - 1; i++) {
            arr[i] = arr[i + 1];
        }
        arr.pop();
    }

    function test() external {
        arr = [1, 2, 3, 4, 5];
        remove(2);
        // [1, 2, 4, 5]
        assert(arr[0] == 1);
        assert(arr[1] == 2);
        assert(arr[2] == 4);
        assert(arr[3] == 5);
        assert(arr.length == 4);

        arr = [1];
        remove(0);
        // []
        assert(arr.length == 0);
    }
}

// Remove array element by copying last element into to the place to remove

contract ArrayReplaceFromEnd {
    uint256[] public arr;

    // Deleting an element creates a gap in the array.
    // One trick to keep the array compact is to
    // move the last element into the place to delete.
    function remove(uint256 index) public {
        // Move the last element into the place to delete
        arr[index] = arr[arr.length - 1];
        // Remove the last element
        arr.pop();
    }

    function test() public {
        arr = [1, 2, 3, 4];

        remove(1);
        // [1, 4, 3]
        assert(arr.length == 3);
        assert(arr[0] == 1);
        assert(arr[1] == 4);
        assert(arr[2] == 3);

        remove(2);
        // [1, 4]
        assert(arr.length == 2);
        assert(arr[0] == 1);
        assert(arr[1] == 4);
    }
}
```

# CallingParentContracts.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/* Inheritance tree
   A
 /  \
B   C
 \ /
  D

Parent contracts can be called directly, or by using the keyword super.

By using the keyword super, all of the immediate parent contracts will be called.
*/

contract A {
    // This is called an event. You can emit events from your funciton
    // and they are logged into the transaction log.
    // In our case, this will be useful for tracing function calls.
    event Log(string message);

    function foo() public virtual {
        emit Log("A.foo called");
    }

    function bar() public virtual {
        emit Log("A.bar called");
    }
}

contract B is A {
    function foo() public virtual override {
        emit Log("B.foo called");
    }

    function bar() public virtual override {
        emit Log("B.bar called");
        super.bar();
    }
}

contract C is A {
    function foo() public virtual override {
        emit Log("C.foo called");
        A.foo();
    }

    function bar() public virtual override {
        emit Log("C.bar called");
        super.bar();
    }
}

contract D is B, C {
    // Try:
    // - Call D.foo and check the transaction logs.
    //  Although D inherits A, B and C, it only called C and then A.
    // - Call D.bar and check the transaction logs
    //  D called C, then B, and finally A.
    //  Although super was called twice (by B and C) it only called A once.

    function foo() public override(B, C) {
        super.foo();
    }

    function bar() public override(B, C) {
        super.bar();
    }
}
```

# Constants.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
Constants are variables that cannot be modified.

Their value is hard coded and using constants can save gas cost.
*/

contract Constants {
    // coding convention to uppercase constant variables
    address public constant MY_ADDRESS = 
        0x777788889999AaAAbBbbCcccddDdeeeEfFFfCcCc;
    uint256 public constant MY_UINT = 123;
}
```

# Constructor.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
A constructor is an optional function that is executed upon contract creation.

Here are examples of how to pass arguments to constructors.
*/

// Base contract X
contract X {
    string public name;

    constructor(string memory _name) {
        name = _name;
    }
}

// Base contract Y
contract Y {
    string public text;

    constructor(string memory _text) {
        text = _text;
    }
}

// There are 2 ways to initialize parent contract with parameters.

// Pass the parameters here in the inheritance list.
contract B is X("Input to X"), Y("Input to Y") {}

contract C is X, Y {
    // Pass the parameters here in the constructor,
    // similar to function modifiers.
    constructor(string memory _name, string memory _text) X(_name) Y(_text) {}
}

// Parent constructors are always called in the order of inheritance
// regardless of the order of parent contracts listed in the
// constructor of the child contract.

// Order of constructors called:
// 1. X
// 2. Y
// 3. D
contract D is X, Y {
    constructor() X("X was called") Y("Y was called") {}
}

// Order of constructors called:
// 1. X
// 2. Y
// 3. E
contract E is X, Y {
    constructor() Y("Y was called") X("X was called") {}
}
```

# Counter.sol

```sol
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
```

# DataLocations.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
Variables are declared as either storage, memory or calldata to explicitly specify the location of the data.

storage - variable is a state variable (stored on the blockchain)
memory - variable is in memory and it exists while a function is being called
calldata - special data location that contains function arguments
*/

contract DataLocations {
    uint256[] public arr;
    mapping(uint256 => address) map;

    struct MyStruct {
        uint256 foo;
    }

    mapping(uint256 => MyStruct) myStructs;

    function f() public {
        // call _f with state variables
        _f(arr, map, myStructs[1]);

        // get a struct from a mapping
    }

    function _f(
        uint256[] storage _arr,
        mapping(uint256 => address) storage _map,
        MyStruct storage _myStruct
    ) internal {
        // do something with storage variables
    }

    // You can return memory variables
    function g(uint256[] memory _arr) public returns (uint256[] memory) {
        // do something with memory array
    }

    function h(uint256[] calldata _arr) external {
        // do something calldata array
    }
}
```

# Enum.sol

```sol
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

```

# EnumDeclaration.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
Declaring and importing Enum

File that the enum is declared in
*/

// This is saved 'EnumDeclaration.sol'

enum Status {
    Pending,
    Shipping,
    Accepted,
    Rejected,
    Canceled
}
```

# EnumImport.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// File that imports the enum above

import "./EnumDeclaration.sol";

contract EnumImport {
    Status public status;
}
```

# Error.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
An error will undo all changes made to the state during a transaction.

You can throw an error by calling require, revert or assert.

require is used to validate inputs and conditions before execution.
revert is similar to require. See the code below for details.
assert is used to check for code that should never be false. Failing assertion probably means that there is a bug.
Use custom error to save gas.

*/

contract Error {
    function testRequire(uint256 _i) public pure {
        // Require should be used to valdate
        // - inputs
        // - conditions before execution
        // - return values from calls to other functions
        require(_i > 10, "Input must be greater than 10");
    }

    function testRevert(uint256 _i) public pure {
        // Revert is useful when the condition to check
        // This code does the exact same thing as the example above
        if (_i <= 10) {
            revert("Input must be greater than 10");
        }
    }

    uint256 public num;

    function testAssert() public view {
        // Assert should only be used to test for internal errors
        // and to check invariants.

        // Here we assert that num is always equal to 0
        // since it is impossible to update the value of num
        assert(num == 0);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function testCustomError(uint256 _withdrawAmount) public view {
        uint256 bal = address(this).balance;
        if (bal < _withdrawAmount) {
            revert InsufficientBalance({
                balance: bal,
                withdrawAmount: _withdrawAmount
            });
        }
    }
}

contract Account {
    uint256 public balance;
    uint256 public constant MAX_UINT = 2 ** 256 - 1;

    function deposit(uint256 _amount) public{
        uint256 oldBalance = balance;
        uint256 newBalance = balance + _amount;

        // balance + _amount does not overflow if balance + _amount >= balance
        require(newBalance >= oldBalance, "Overflow");

        balance = newBalance;

        assert(balance >= oldBalance);
    }

    function withdraw(uint256 _amount) public {
        uint256 oldBalance = balance;

        // balance - _amount does not underflow if balance >= _amount
        require(balance >= _amount, "Underflow");

        if (balance < _amount) {
            revert("Underflow");
        }

        balance -= _amount;

        assert(balance <= oldBalance);
    }
}
```

# EtherUnits.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
Transactions are paid with ether.

Similar to how one dollar is equal to 100 cent, one ether is equal to 10^18 wei.
*/

contract EtherUnits {
    uint256 public oneWei = 1 wei;
    // 1 wei is equal to 1
    bool public isOneWei = (oneWei == 1);

    uint256 public oneGwei = 1 gwei;
    // 1 gwei is equal to 10^9 wei
    bool public isOneGwei = (oneGwei == 1e9);

    uint256 public oneEther = 1 ether;
    // 1 ether is equal to 10^18 wei
    bool public isOneEther = (oneEther == 1e18);
}
```

# Events.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
Events allow logging to the Ethereum blockchain. Some use cases for events are:

Listening for events and updating user interface
A cheap form of storage
*/


contract Event {
    // Event declaration
    // Up to 3 parameters can be indexed
    // Indexed parameters helps you filter the logs by the indexed parameter
    event Log(address indexed sender, string message);
    event AnotherLog();

    function test() public {
        emit Log(msg.sender, "Hello world!");
        emit Log(msg.sender, "Hello EVM!");
        emit AnotherLog();
    }
}
```

# EventsAdvanced.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

/*
Events in Solidity are a powerful tool that enables various advanced functionalities and architectures. Some advanced use cases for events include:

- Event filtering and monitoring for real-time updates and analytics
- Event log analysis and decoding for data extraction and processing
- Event-driven architectures for decentralized applications (dApps)
- Event subscriptions for real-time notifications and updates

Event-Driven Architecture
The EventDrivenArchitecture contract demonstrates an event-driven architecture where events are used to coordinate and trigger different stages of a process, such as initiating and confirming transfers.

Event Subscription and Real-Time Updates
The EventSubscription contract showcases how to implement event subscriptions, allowing external contracts or clients to subscribe and receive real-time updates when events are emitted. It also demonstrates how to handle event subscriptions and manage the subscription lifecycle.

Best Practices and Recommendations
Index the right event parameters to enable efficient filtering and searching. Addresses should typically be indexed, while amounts generally should not.
Avoid redundant events by not emitting events that are already covered by underlying libraries or contracts.
Events cannot be used in view or pure functions, as they alter the state of the blockchain by storing logs.
Be mindful of the gas cost associated with emitting events, especially when indexing parameters, as it can impact the overall gas consumption of your contract.
*/

// Event-Driven Architecture
contract EventDrivenArchitecture {
    event TransferInitiated(
        address indexed from, address indexed to, uint256 value
    );
    event TransferConfirmed(
        address indexed from, address indexed to, uint256 value
    );

    mapping(bytes32 => bool) public transferConfirmations;

    function initiateTransfer(address to, uint256 value) public {
        emit TransferInitiated(msg.sender, to, value);
        // ... (initiate transfer logic)
    }

    function confirmTransfer(bytes32 transferId) public {
        require(
            !transferConfirmations[transferId], "Transfer already confirmed"
        );
        transferConfirmations[transferId] = true;
        emit TransferConfirmed(msg.sender, address(this), 0);
        // ... (confirm transfer logic)
    }
}

// Event Subscription and Real-Time Updates
interface IEventSubscriber {
    function handleTransferEvent(address from, address to, uint256 value) 
        external;
}

contract EventSubscription {
    event LogTransfer(address indexed from, address indexed to, uint256 value);

    mapping(address => bool) public subscribers;
    address[] public subscriberList;

    function subscribe() public {
        require(!subscribers[msg.sender], "Already subscribed");
        subscriberList.push(msg.sender);
    }

    function unsubscribe() public {
        require(subscribers[msg.sender], "Not subscribed");
        subscribers[msg.sender] = false;
        for (uint256 i = 0; i < subscriberList.length; i++) {
            if (subscriberList[i] == msg.sender) {
                subscriberList[i] = subscriberList[subscriberList.length - 1];
                subscriberList.pop();
                break;
            }
        }
    }

    function transfer(address to, uint256 value) public {
        emit LogTransfer(msg.sender, to, value);
        for (uint256 i = 0; i < subscriberList.length; i++) {
            IEventSubscriber(subscriberList[i]).handleTransferEvent(
                msg.sender, to, value
            );
        }
    }
}
```

# Function.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
There are several ways to return outputs from a function.

Public functions cannot accept certain data types as inputs or outputs
*/

contract Function {
    // Functions can return multiple values.
    function returnMany() public pure returns (uint256, bool, uint256) {
        return (1, true, 2);
    }

    // Return values can be named.
    function named() public pure returns (uint256 x, bool b, uint256 y) {
        return (1, true, 2);
    }

    // Return values can be assigned to their name.
    // In this case the return statement can be omitted.
    function assigned() public pure returns (uint256 x, bool b, uint256 y) {
        x = 1;
        b = true;
        y = 2;
    }

    // Use destructuring assignment when calling another
    // function that returns multiple values.
    function destructuringAssignments()
        public
        pure
        returns (uint256, bool, uint256, uint256, uint256)
    {
        (uint256 i, bool b, uint256 j) = returnMany();

        // Values can be left out.
        (uint256 x,, uint256 y) = (4, 5, 6);

        return (i, b, j, x, y);
    }

    // Cannot use map for either input or output

    // Can use array for input
    function arrayInput(uint256[] memory _arr) public {}

    // Can use array for output
    uint256[] public arr;

    function arrayOuput() public view returns (uint256[] memory) {
        return arr;
    }
}

// Call function with key-value inputs
contract XYZ {
    function someFuncWithManyInputs(
        uint256 x,
        uint256 y,
        uint256 z,
        address a,
        bool b,
        string memory c
    ) public pure returns (uint256) { /* whatever calculation you want */ }

    function callFunc() external pure returns (uint256) {
        return someFuncWithManyInputs(1, 2, 3, address(0), true, "c");
    }

    function callFuncWithKeyValue() external pure returns (uint256) {
        return someFuncWithManyInputs({
            a: address(0),
            b: true,
            c: "c",
            x: 1,
            y: 2,
            z: 3
        });
    }
}
```

# FunctionModifier.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
Modifiers are code that can be run before and / or after a function call.

Modifiers can be used to:

Restrict access
Validate inputs
Guard against reentrancy hack
*/

contract FunctionModifier {
    // We will use these variables to demonstrate how to use
    // modifiers
    address public owner;
    uint256 public x = 10;
    bool public locked;

    constructor() {
        // Set the transaction sender as the owner of the contract.
        owner = msg.sender;
    }

    // Modifier to check that the caller is the owner of the contract.
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        // Underscore is a special character only used inside
        // a function modifier and it tells Solidity to
        // execute the rest of the code.
        _;
    }

    // Modifiers can take inputs. This modifer checks that the
    // address apssed in is not the aero address. 
    modifier validAddress(address _addr) {
        require(_addr != address(0), "Not valid address");
        _;
    }

    function changeOwner(address _newOwner)
        public
        onlyOwner
        validAddress(_newOwner) 
    {
        owner = _newOwner;
    }

    // Modifiers can be called before and / or after a function.
    // This modifier prevents a function from being called while
    // it is still executing.
    modifier noReentrancy() {
        require(!locked, "No reentrancy");

        locked = true;
        _;
        locked = false;
    }

    function decrement(uint256 i) public noReentrancy {
        x -= i;

        if (i > 1) {
            decrement(i - 1);
        }
    }
}
```

# Gas.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
How much ether do you need to pay for a transaction?
You pay: gas spent * gas price amount of ether, where

- gas is a unit of computation
- gas spent is the total amount of gas used in a transaction
- gas price is how much ether you are willing to pay per gas
- Transactions with higher gas price have higher priority to be included in a block.

Unspent gas will be refunded.

Gas Limit
There are 2 upper bounds to the amount of gas you can spend

gas limit (max amount of gas you're willing to use for your transaction, set by you)
block gas limit (max amount of gas allowed in a block, set by the network)
*/

contract Gas {
    uint256 public i = 0;

    // Using up all of the gas that you send causes your transaction to fail.
    // State changes are undone.
    // Gas spent are not refunded.
    function forever() public {
        // Here we run a loop until all of the gas are spent
        // and the transaction fails
        while (true) {
            i += 1;
        }
    }
}
```

# IfElse.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// Solidity supports conditional statements if, else if and else.

contract IfElse {
    function foo(uint256 x) public pure returns (uint256) {
        if (x < 10) {
            return 0;
        } else if (x < 20) {
            return 1;
        } else {
            return 2;
        }
    }

    function ternary(uint256 _x) public pure returns (uint256) {
        // if (_x < 10) {
        //     return 1;
        // }
        // return 2;
        
        // shorthand way to write if / else statement
        // the "?" operator is called the ternary operator
        return _x < 10 ? 1 : 2;
    }
}
```

# Immutable.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/* Immutable variables are like constants. Values of immutable variables can be set inside the constructor but cannot be modified afterwards. */

contract Immutable {
    // coding convention to uppercase constant variables
    address public immutable MY_ADDRESS;
    uint256 public immutable MY_UINT;

    constructor(uint256 _myUnit) {
        MY_ADDRESS = msg.sender;
        MY_UINT = _myUnit;
    }
}
```

# Inheritance.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/* Graph of inheritance
    A
   / \
  B   C
 / \ /
F  D,E

Solidity supports multiple inheritance. Contracts can inherit other contract by using the is keyword.

Function that is going to be overridden by a child contract must be declared as virtual.

Function that is going to override a parent function must use the keyword override.

Order of inheritance is important.

You have to list the parent contracts in the order from “most base-like” to “most derived”.
*/

contract A {
    function foo() public pure virtual returns (string memory) {
        return "A";
    }
}

// Contracts inherit other contracts by using the keyword 'is'.
contract B is A {
    // Override A.foo()
    function foo() public pure virtual override returns (string memory) {
        return "B";
    }
}

contract C is A {
    // Override A.foo()
    function foo() public pure virtual override returns (string memory) {
        return "C";
    }
}

// Contracts can inherit from multiple parent contracts.
// When a function is called that is defined multiple times in
// different contracts, parent contracts are searched from
// right to left, and in depth-first manner.

contract D is B, C {
    // D .foo() returns "C"
    // since C is the right most parent contract with function foo()
    function foo() public pure override(B, C) returns (string memory) {
        return super.foo();
    }
}

contract E is C, B {
    // E.foo() returns "B"
    // since B is the right most parent contract with function foo()
    function foo() public pure override(C, B) returns (string memory) {
        return super.foo();
    }
}

// Inheritance must be ordered from "most base-like" to "most-derived".
// Swapping the order of A and B will throw a compilation error.
contract F is A, B {
    function foo() public pure override(A, B) returns (string memory) {
        return super.foo();
    }
}
```

# Interface.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
You can interact with other contracts by declaring an Interface.

Interface

- cannot have any functions implemented
- can inherit from other interfaces
- all declared functions must be external
- cannot declare a constructor
- cannot declare state variables
*/

contract Counter {
    uint256 public count;

    function increment() external {
        count += 1;
    }
}

interface ICounter {
    function count() external view returns (uint256);

    function increment() external;
}

contract MyContract {
    function incrementCounter(address _counter) external {
        ICounter(_counter).increment();
    }

    function getCount(address _counter) external view returns (uint256) {
        return ICounter(_counter).count();
    }
}

// Uniswap example
interface UniswapV2Factory {
    function getPair(address tokenA, address tokenB)
        external
        view
        returns (address pair);
}

interface UniswapV2Pair {
    function getReserves()
        external
        view
        returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
}

contract UniswapExample {
    address private factory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address private dai = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address private weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    function getTokenReserves() external view returns (uint256, uint256) {
        address pair = UniswapV2Factory(factory).getPair(dai, weth);
        (uint256 reserve0, uint256 reserve1,) =
            UniswapV2Pair(pair).getReserves();
        return (reserve0, reserve1);
    }
}
```

# Loop.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
Solidity supports for, while, and do while loops.

Don't write loops that are unbounded as this can hit the gas limit, causing your transaction to fail.

For the reason above, while and do while loops are rarely used.
*/

contract Loop {
    function loop() public {
        // for loop
        for (uint256 i = 0; i < 10; i++) {
            if (i == 3) {
                // Skip to next iteration with continue
                continue;
            }
            if (i == 5) {
                // Exit loop with break
                break;
            }
        }

        // while loop
        uint256 j;
        while (j < 10) {
            j++;
        }
    }
}
```

# Mapping.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
Maps are created with the syntax mapping(keyType => valueType).

The keyType can be any built-in value type, bytes, string, or any contract.

valueType can be any type including another mapping or an array.

Mappings are not iterable.
*/

contract Mapping {
    // Mapping from address to uint
    mapping(address => uint256) public myMap;

    function get(address _addr) public view returns (uint256) {
        // Mapping always returns a value.
        // If the value was never set, it will return the default value.
        return myMap[_addr];
    }

    function set(address _addr, uint256 _i) public {
        // Update the value at this address
        myMap[_addr] = _i;
    }

    function remove(address _addr) public {
        // Reset the value to the default value.
        delete myMap[_addr];
    }
}

contract NestedMapping {
    // Nested mapping (mapping from address to another mapping)
    mapping(address => mapping(uint256 => bool)) public nested;

    function get(address _addr1, uint256 _i) public view returns (bool) {
        // You can get values from a nested mapping
        // even when it is not initialized
        return nested[_addr1][_i];
    }

    function set(address _addr1, uint256 _i, bool _boo) public {
        nested[_addr1][_i] = _boo;
    }

    function remove(address _addr1, uint256 _i) public {
        delete nested[_addr1][_i];
    }
}
```

# Payable.sol

```sol
// SPDX-License-Identifier: MIT

contract Payable {
    // Payable address can send Ether via transfer or send
    address payable public owner;

    // Payable constructor can receive Ether
    constructor() payable {
        owner = payable(msg.sender);
    }

    // Function to deposit Ether into this contract
    // Call this function along with some Ether.
    // The balance of this contract will be automatically updated.
    function deposit() public payable {}

    // Call this function along with some Ether
    // The function will throw an error since this function is not payable
    function notpayable() public {}

    // Function to withdraw all Ether from this contract.
    function withdraw() public {
        // get the amount of Ether stored in this contract
        uint256 amount = address(this).balance;
        
        // send all Ether to owner
        (bool success,) = owner.call{value: amount}("");
        require(success, "Failed to send Ether");
    }

    // Function to trasnfer Ether from this contract to address from input
    function transfer(address payable _to, uint256 _amount) public {
        // Note that "to" is declared as payable
        (bool success,) = _to.call{value: _amount}("");
        require(success, "Failed to send Ether");
    }
}
```

# Primitives.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Primitives {
    bool public boo = true;
    
    /*
    uint stands for unsigned integer, meaning non negative integers
    different sizes are available
        uint8 ranges from 0 to 2 ** 8 - 1
        uint6 ranges from 0 to 2 ** 16 - 1
        ...
        uint256 ranges from 0 to 2 ** 256 - 1
    */
    uint8 public u8 = 1;
    uint256 public u256 = 456;
    uint256 public u = 123; // uint is an alias for uint256

   /*
   Negative numbers are allowed for int types.
   Like uint, different ranges are available from int8 to int256

   int256 ranges from -2 ** 255 to 2 ** 255 - 1
   int128 ranges from -2 ** 127 to 2 ** 127 - 1
   */
   int8 public i8 = -1;
   int256 public i256 = 456;
   int256 public i = -123; // int is same as int256

   // minimum and maximum of int
   int256 public minInt = type(int256).min;
   int256 public maxInt = type(int256).max;

   address public addr = 0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c;

   /*
   In Solidity, the data type byte represent a sequence of bytes.
   Solidity presents two types of bytes types :

   - fixed-sized byte arrays
   - dynamically-sized arrays.

   The term bytes in Solidity represents a dynamic array of bytes.
   It's a shorthand for byte[] .
   */

   bytes1 a = 0xb5; // [10110101]
   bytes1 b = 0x56; // [01010110]

   // Default values
   // Unsigned variables have a default value
   bool public defaultBool; // false
   uint256 public defaultUint; // 0
   int256 public defaultInt; // 0
   address public defaultAddr; // 0x0000000000000000000000000000000000000000
}
```

# ShadowingInheritance.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
Unlike functions, state variables cannot be overridden by re-declaring it in the child contract.

Let's learn how to correctly override inherited state variables.
*/

contract A {
    string public name = "Contract A";

    function getName() public view returns (string memory) {
        return name;
    }
}

// Shadowing is disallowed in Solidity 0.6
// This will not compile
// contract B is A {
//      string public name = "Contract B"
// }

contract C is A {
    // This is the correct way to override inherited state variables.
    constructor() {
        name = "Contract C";
    }

    // C.getName returns "Contract C"
}
```

# SimpleStorage.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
To write or update a state variable you need to send a transaction.

On the other hand, you can read state variables, for free, without any transaction fee.
*/

contract SimpleStorage {
    // State variable to store a number
    uint256 public num;

    // You need to send a transaction to write to a state variable.
    function set(uint256 _num) public {
        num = _num;
    }

    // You can read from a state variable without sending a transaction
    function get() public view returns (uint256) {
        return num;
    }
}
```

# StructDeclaration.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
// This is saved 'StructDeclaration.sol'

struct Todo {
    string text;
    bool completed;
}
```

# StructImport.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./StructDeclaration.sol";

contract StructImport {
    // An array of 'Todo' structs
    Todo[] public todos;
}
```

# Structs.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
You can define your own type by creating a struct.

They are useful for grouping together related data.

Structs can be declared outside of a contract and imported in another contract.
*/

contract Todos {
    struct Todo {
        string text;
        bool completed;
    }

    // An array of 'Todo' structs
    Todo[] public todos;

    function create(string calldata _text) public {
        // 3 ways to intiialize a struct
        // - calling it like a function
        todos.push(Todo(_text, false));

        // key value mapping
        todos.push(Todo({text: _text, completed: false}));

        // initialize an empty struct and then update it
        Todo memory todo;
        todo.text = _text;
        /* todo.completed intialized to false */

        todos.push(todo);
    }

    // Solidity automatically created a getter for 'todos'
    // you don't actually need this function.
    function get(uint256 _index)
        public
        view
        returns (string memory text, bool completed)
    {
        Todo storage todo = todos[_index];
        return (todo.text, todo.completed);
    }

    // update text
    function updateText(uint256 _index, string calldata _text) public {
        Todo storage todo = todos[_index];
        todo.text = _text;
    }

    // update completed
    function toggleCompleted(uint256 _index) public {
        Todo storage todo = todos[_index];
        todo.completed = !todo.completed;
    }
}
```

# TransientStorage.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// Make sure EVM version and VM set to Cancun

// Storage - data is stored on the blockchain
// Memory - data is cleared out after a function call
// Transient storage - data is cleared out after a transaction

interface ITest {
    function val() external view returns (uint256);
    function test() external;
}

contract Callback {
    uint256 public val;

    fallback() external {
        val = ITest(msg.sender).val();
    }

    function test(address target) external {
        ITest(target).test();
    }
}

contract TestStorage {
    uint256 public val;

    function test() public {
        val = 123;
        bytes memory b = "";
        msg.sender.call(b);
    }
}

contract TestTransientStorage {
    bytes32 constant SLOT = 0;

    function test() public {
        assembly {
            tstore(SLOT, 321)
        }
        bytes memory b = "";
        msg.sender.call(b);
    }

    function val() public view returns (uint256 v) {
        assembly {
            v := tload(SLOT)
        }
    }
}

contract ReentrancyGuard {
    bool private locked;

    modifier lock() {
        require(!locked);
        locked = true;
        _;
        locked = false;
    }

    // 35313 gas
    function test() public lock {
        // Ignore call error
        bytes memory b = "";
        msg.sender.call(b);
    }
}

contract ReentrancyGuardTransient {
    bytes32 constant SLOT = 0;

    modifier lock() {
        assembly {
            if tload(SLOT) { revert(0, 0) }
            tstore(SLOT, 1)
        }
        _;
        assembly {
            tstore(SLOT, 0)
        }
    }

    // 21887 gas
    function test() external lock {
        // Ignore call error
        bytes memory b = "";
        msg.sender.call(b);
    }
}

```

# UserDefinedValueTypes.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// Code copied from optimism
// https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts-bedrock/src/dispute/lib/LibUDT.sol

type Duration is uint64;

type Timestamp is uint64;

type Clock is uint128;


library LibClock {
    function wrap(Duration _duration, Timestamp _timestamp)
        internal
        pure
        returns (Clock clock_)
    {
        assembly {
            // data | Duration | Timestamp
            // bit  | 0 ... 63 | 64 ... 127
            clock_ := or(shl(0x40, _duration), _timestamp)
        }
    }

    function duration(Clock _clock)
        internal
        pure
        returns (Duration duration_) 
    {
        assembly {
            duration_ := shr(0x40, _clock)
        }
    }

    function timestamp(Clock _clock)
        internal
        pure
        returns (Timestamp timestamp_)
    {
        assembly {
            timestamp_ := shr(0xC0, shl(0xC0, _clock))
        }
    }
}

// Clock library without user defined value type
library LibClockBasic {
    function wrap(uint64 _duration, uint64 _timestamp)
        internal
        pure
        returns (uint128 clock)
    {
        assembly {
            clock := or(shl(0x40, _duration), _timestamp)
        }
    }
}

contract Examples {
    function example_no_uvdt() external view {
        // Without UDVT
        uint128 clock;
        uint64 d = 1;
        uint64 t = uint64(block.timestamp);
        clock = LibClockBasic.wrap(d, t);
        // Oops! wrong order of inputs but still compiles
        clock = LibClockBasic.wrap(t, d);
    }

    function example_uvdt() external view {
        // Turn value type into user defined value type
        Duration d = Duration.wrap(1);
        Timestamp t = Timestamp.wrap(uint64(block.timestamp));
        // Turn user defined value type back into primitive value type
        uint64 d_u64 = Duration.unwrap(d);
        uint64 t_u54 = Timestamp.unwrap(t);

        // LibClock example
        Clock clock = Clock.wrap(0);
        clock = LibClock.wrap(d, t);
        // Oops! wrong order of inputs
        // This will not compile
        // clock = LibClock.wrap(t, d);
    }
}
```

# Variables.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
There are 3 types of variables in Solidity

local
    - declared inside a function
    - not stored on the blockchain

state
    - declared outside a function
    - stored on the blockchain

global (provides information about the blockchain)
*/

contract Variables {
    // State variables are stored on the blockchain.
    string public text = "Hello";
    uint256 public num = 123;

    function doSomething() public {
        // Local variables are not saved to the blockchain
        uint256 i = 456;

        // Here are some global variables
        uint256 timestamp = block.timestamp; // Current block timestamp
        address sender = msg.sender; // address of the caller
    }
}
```

# ViewAndPure.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
Getter functions can be declared view or pure.

View function declares that no state will be changed.

Pure function declares that no state variable will be changed or read.
*/

contract ViewAndPure {
    uint256 public x = 1;

    // Promise not to modify the state.
    function addToX(uint256 y) public view returns (uint256) {
        return x + y;
    }

    // Promise not to modify or read from state.
    function add(uint256 i, uint256 j) public pure returns (uint256) {
        return i + j;
    }
}
```

# Visibility.sol

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*
Functions and state variables have to declare whether they are accessible by other contracts.

Functions can be declared as

public - any contract and account can call
private - only inside the contract that defines the function
internal- only inside contract that inherits an internal function
external - only other contracts and accounts can call
State variables can be declared as public, private, or internal but not external.
*/

contract Base {
    // Private function can only be called
    // - inside this contract
    // Contracts that inherit this contract cannot call this function.
    function privateFunc() private pure returns (string memory) {
        return "private function called";
    }

    function testPrivateFunc() public pure returns (string memory) {
        return privateFunc();
    }

    // Internal function can be called
    // - inside this contract
    // - inside contracts that inherit this contract
    function internalFunc() internal pure returns (string memory) {
        return "internal function called";
    }

    function testInternalFunc() public pure virtual returns (string memory) {
        return internalFunc();
    }

    // Public function can be called
    // - inside this contract
    // - inside contracts that inherit this contract
    // - by other contracts and accounts
    function publicFunc() public pure returns (string memory) {
        return "public function called";
    }

    // External functions can only be called
    // - by other contracts and accounts
    function externalFunc() external pure returns (string memory) {
        return "external function called";
    }

    // This function will not compile since we're trying to call
    // an external function here.
    // function testExternalFunc() public pure returns (string memory) {
    // return externalFunc();
    // }

    // State variables
    string private privateVar = "my private variable";
    string internal internalVar = "my internal variable";
    string public publicVar = "my public variable";
    // State variables cannot be external so this code won't compile.
    // string external externalVar = "my external variable";
}

contract Child is Base {
    // Inherited contracts do not have access to private functions
    // and state variables.
    // function testPrivateFunc() public pure returns (string memory) {
    //      return privateFunc();
    // }

    // Internal function can be called inside child contracts.
    function testInternalFunc() public pure override returns (string memory) {
        return internalFunc();
    }
}
```

