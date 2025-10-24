// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./MyMintableToken.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
/**
 * @title MerkleAirdropMinter
 * @dev UUPS-upgradeable contract for claiming ERC20 tokens using a Merkle proof.
 */
contract MerkleAirdropUpgradeable  is
    Initializable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable,
    AccessControlUpgradeable
{
    bytes32 public merkleRoot;
    MyMintableToken public token;
    mapping(address => bool) public claimed;

    event Claimed(address indexed account, uint256 amount);
    event MerkleRootUpdated(bytes32 oldRoot, bytes32 newRoot);

    bytes32 public constant ROOT_SETTER_ROLE = keccak256("ROOT_SETTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers(); // ensures logic contract can't be initialized directly
    }

    function initialize(address tokenAddress, bytes32 _merkleRoot) public initializer {
        require(tokenAddress != address(0), "Invalid token address");
        __AccessControl_init();
        __Ownable_init(msg.sender);
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ROOT_SETTER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);

        token = MyMintableToken(tokenAddress);
        merkleRoot = _merkleRoot;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    function claim(uint256 amount, bytes32[] calldata proof)
        external
        nonReentrant
    {
        require(!claimed[msg.sender], "Already claimed");
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid proof");

        claimed[msg.sender] = true;
        token.mint(msg.sender, amount);

        emit Claimed(msg.sender, amount);
    }

    function updateMerkleRoot(bytes32 newRoot) external onlyOwner {
        bytes32 old = merkleRoot;
        merkleRoot = newRoot;
        emit MerkleRootUpdated(old, newRoot);
    }
}
