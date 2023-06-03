import { task } from "hardhat/config";

task("calc-error-id", "Prints Errors enum").setAction(async (args, hre) => {
  const errFactory = await hre.ethers.getContractFactory("ErrorsIdCalculator");
  const errInstance = await errFactory.deploy();

  console.info("export enum CustomErrors {");
  Object.entries(errInstance.interface.errors).map(([val, _fragment]) =>
    console.info(`"${val.split("(")[0]}": "${hre.ethers.utils.id(val).slice(0, 10)}"`),
  );
  console.info("}");
});
