**Cấu trúc thư mục
merkle-tree-demo/
│
├── src/
│   ├── buildTree.ts       # Sinh Merkle Root và Proofs từ whitelist
│   ├── verifyProof.ts     # Kiểm chứng địa chỉ trong whitelist
│   └── utils.ts           # Hàm tiện ích
│
├── whitelist.json         # Danh sách địa chỉ whitelist
├── output/
│   ├── merkleRoot.txt     # Merkle Root được sinh ra
│   └── proofs.json        # Bằng chứng Merkle Proofs
│
├── package.json
├── tsconfig.json
└── README.md
**Sinh Merkle Tree
```bash
npx ts-node src/buildTree.ts
**Kiểm chứng địa chỉ
npx ts-node src/verifyProof.ts