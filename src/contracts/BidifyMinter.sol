// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./BidifyToken.sol";

contract BidifyMinter is BidifyToken {
    BidifyToken public tokenAddress;
    uint256 public mintCost = 1e16;
    address public devWallet;
    uint256 private totalAmount;

    constructor() {
        tokenAddress = new BidifyToken();
        devWallet = msg.sender;
    }
    
    function mint(string memory uri) external payable {
        require(msg.value >= mintCost, "Minting fee is lower than price!");
        totalAmount += msg.value;
        // uint mintFee = msg.value;
        // payable(adminWallet).call()
        tokenAddress.safeMint(msg.sender, uri);
    }

    function multipleMint(string memory uri, uint8 count) external payable {
        require(msg.value >= mintCost * count, "Minting fee is lower than price");
        for(uint8 i = 0; i < count; i ++) {
            totalAmount += msg.value;
            tokenAddress.safeMint(msg.sender, uri);
        }
    }

    function setDevWallet(address to) external onlyOwner {
        devWallet = to;
    }

    function setMintCost(uint256 _value) external onlyOwner {
        mintCost = _value;
    }

    function withdraw() external onlyOwner {
        uint256 ownerFee = totalAmount / 2;
        (bool succeedOwner, ) = payable(msg.sender).call{value: ownerFee}("");
        require(succeedOwner, "Failed to withdraw to the owner");
        totalAmount -= ownerFee;
        (bool succeedDev, ) = payable(devWallet).call{value: totalAmount}("");
        require(succeedDev, "Failed to withdraw to the dev");
        totalAmount = 0;
    }
}