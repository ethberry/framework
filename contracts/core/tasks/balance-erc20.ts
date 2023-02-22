import { task } from "hardhat/config";

task("balance-erc20", "Prints an ERC20 balance")
  .addParam("account", "The account's address")
  .addParam("contract", "The ERC20 contract's address")
  .setAction(async (args, hre) => {
    const { account, contract } = args;

    // const coinFactory = await hre.ethers.getContractFactory("LinkToken");
    const coinFactory = await hre.ethers.getContractFactory("ERC20Simple");
    const coinInstance = coinFactory.attach(contract);
    const accBalance = await coinInstance.balanceOf(account);
    console.info("ERC20 Balance:", hre.ethers.utils.formatEther(accBalance.toString()));
    process.exit(0);
  });

// hardhat balance-erc20 --account 0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73 --contract 0xa2b80d63b1f72a4d26dfc33d62ebe80148ddd326 --network besu
// hardhat balance-erc20 --account 0xb470f7347c822acd02333de25144abf2cd26c284 --contract 0x8BCaF30fed623A721aB6A2E9A9ed4f0b2F141Bfd --network besu
// hardhat balance-erc20 --account 0xfe3b557e8fb62b89f4916b721be55ceb828dbd73 --contract 0x7a01a65372860d3a2165060d1c471259070a1d5c --network besu
