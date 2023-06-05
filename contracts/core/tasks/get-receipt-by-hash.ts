import { task } from "hardhat/config";

task("get-receipt-by-hash", "Get transaction receipt")
  .addParam("txHash", "transaction hash")
  .setAction(async (args, hre) => {
    const { txHash } = args;

    const txReceipt = await hre.ethers.provider.getTransaction(txHash);

    console.info(txReceipt);
  });

// hardhat get-receipt-by-hash --tx-hash 0x8e4acbd83adf954d568264b8eb659cd213fcadf8141243d5eaf68a30535c54f4
