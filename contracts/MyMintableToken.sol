// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyMintableToken
 * @dev Token ERC20 có thể mint, chỉ owner (người deploy) được phép mint thêm token
 */
contract MyMintableToken is ERC20, Ownable {
    // Constructor khởi tạo token với tên và ký hiệu
    constructor() ERC20("MyMintableToken", "MMT") Ownable(msg.sender) {}

    /**
     * @dev Chỉ owner được phép gọi để mint token mới
     * @param to Địa chỉ nhận token
     * @param amount Số lượng token (tính theo đơn vị nhỏ nhất, ví dụ 1e18 = 1 token)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Hàm trả về số dư của một địa chỉ (đã có sẵn trong ERC20, nhưng viết rõ để minh họa)
     */
    function getBalance(address account) external view returns (uint256) {
        return balanceOf(account);
    }
}
