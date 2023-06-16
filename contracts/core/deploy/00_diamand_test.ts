import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const DeployDiamond: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const [owner] = await hre.getUnnamedAccounts();
  const { diamond } = hre.deployments;

  // console.log("deployer:::", deployer, owner);
  await diamond.deploy("ExchangeUp", {
    from: owner,
    autoMine: true,
    log: true,
    waitConfirmations: 1,
    facets: ["ExchangeCoreUpgrade"],
    execute: {
      contract: "InitFacetTest",
      methodName: "init",
      args: [],
    },
  });

  // console.log(res);
};

export default DeployDiamond;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
DeployDiamond.tags = ["YourContract"];
