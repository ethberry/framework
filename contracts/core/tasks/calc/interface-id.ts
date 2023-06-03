import { task } from "hardhat/config";

task("calc-interface-id", "Prints Errors enum").setAction(async (args, hre) => {
  const errFactory = await hre.ethers.getContractFactory("InterfaceIdCalculator");
  const errInstance = await errFactory.deploy();
  await errInstance.test();
});
