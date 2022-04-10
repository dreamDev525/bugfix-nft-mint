// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./BidifyToken.sol";

contract BidifyMinter {
    BidifyToken public tokenAddress;
    address public dev;
    address public admin;

    constructor() {
        tokenAddress = new BidifyToken();
        dev = msg.sender;
        admin = msg.sender;
    }

    modifier onlyManager() {
        require(msg.sender == dev, "only admin!");
        _;
    }

    function calculateCost(uint amount) public pure returns(uint cost) {
        if(amount < 10) cost = 1e17;
        else if(amount < 100) cost = 1e18;
        else cost = 1e19;
    }
    
    function multipleMint(string memory uri, uint8 count) external payable {
        require(count <= 50, "Minting amount can't be over 50!");
        uint256 mintCost = calculateCost(count);
        require(msg.value >= mintCost, "Minting fee is lower than price");
        for(uint8 i = 0; i < count; i ++) {
            BidifyToken(tokenAddress).safeMint(msg.sender, uri);
        }
        uint256 _cost = msg.value;
        uint256 ownerFee = _cost / 2;
        (bool succeedOwner, ) = payable(admin).call{value: ownerFee}("");
        require(succeedOwner, "Failed to withdraw to the owner");
        _cost -= ownerFee;
        (bool succeedDev, ) = payable(dev).call{value: _cost}("");
        require(succeedDev, "Failed to withdraw to the dev");
        _cost = 0;
    }

    function setdev(address to) external onlyManager {
        dev = to;
    }

    function setAdmin(address to) external onlyManager {
        admin = to;
    }

    function withdraw() external onlyManager {
        uint256 amount = address(this).balance;
        (bool succeedOwner, ) = payable(msg.sender).call{value: amount}("");
        require(succeedOwner, "Failed to withdraw to the owner");
    }
}