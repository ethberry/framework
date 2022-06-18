import { task } from "hardhat/config";
import { Contract, ContractInterface, ethers } from "ethers";

task("interface", "Prints a contract's interfaceID")
  // .addParam("contract", "The contract's name")
  .setAction(async (args, hre) => {
    // const { contract } = args;

    const getInterfaceID = (contractInterface: ethers.utils.Interface) => {
      let interfaceID: ethers.BigNumber = ethers.constants.Zero;
      const functions: string[] = Object.keys(contractInterface.functions);
      for (let i = 0; i < functions.length; i++) {
        interfaceID = interfaceID.xor(contractInterface.getSighash(functions[i]));
      }

      return interfaceID;
    };

    const coinFactory = await hre.ethers.getContractFactory("ERC721Random");
    const interfaceID = getInterfaceID(coinFactory.interface);

    console.info("interfaceID:", interfaceID);
    console.info("interfaceID.toStr:", interfaceID.toString());
  });
