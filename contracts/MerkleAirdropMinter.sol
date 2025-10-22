// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./MyMintableToken.sol";

/**
 * @title MerkleAirdropMinter
 * @dev Cho phép người trong whitelist được mint token bằng cách chứng minh Merkle Proof
 */
contract MerkleAirdropMinter is Ownable, ReentrancyGuard {
    bytes32 public merkleRoot;
    MyMintableToken public immutable token;

    mapping(address => bool) public claimed; // tránh double-mint

    event Claimed(address indexed account, uint256 amount);
    event MerkleRootUpdated(bytes32 oldRoot, bytes32 newRoot);

    constructor(address tokenAddress, bytes32 _merkleRoot) Ownable(msg.sender) {
        require(tokenAddress != address(0), "token=0");
        token = MyMintableToken(tokenAddress);
        merkleRoot = _merkleRoot;
    }

    /**
     * @dev Người dùng gọi hàm này để claim token nếu họ có trong Merkle Tree
     * @param account Địa chỉ người dùng
     * @param amount Số lượng token được phép claim
     * @param proof Merkle Proof để chứng minh quyền claim
     */
    function claim(address account, uint256 amount, bytes32[] calldata proof) external {
        require(!claimed[account], "Already claimed");
        bytes32 leaf = keccak256(abi.encodePacked(account, amount));
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid proof");

        claimed[account] = true;
        token.transfer(account, amount); // ✅ gửi token
    }


    /**
     * @dev Chỉ owner được phép cập nhật Merkle Root (tuỳ chọn, có thể bỏ để root cố định)
     */
    function updateMerkleRoot(bytes32 newRoot) external onlyOwner {
        bytes32 old = merkleRoot;
        merkleRoot = newRoot;
        emit MerkleRootUpdated(old, newRoot);
    }
}
