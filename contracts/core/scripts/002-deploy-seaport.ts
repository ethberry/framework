import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { blockAwait } from "./utils/blockAwait";

async function main() {
  const [owner] = await ethers.getSigners();

  const conduitControllerFactory = await ethers.getContractFactory("ConduitController");
  const conduitController = await conduitControllerFactory.deploy();
  console.info(`CONDUIT_CONTROLLER_ADDR=${conduitController.address.toLowerCase()}`);

  const seaportFactory = await ethers.getContractFactory("Seaport");
  const seaport = await seaportFactory.deploy(conduitController.address, { gasLimit: BigNumber.from(300_000_000) });
  console.info(`SEAPORT_ADDR=${seaport.address.toLowerCase()}`);

  const conduitKeyOne = `${owner.address}000000000000000000000000`;
  await conduitController.createConduit(conduitKeyOne, owner.address);

  await blockAwait(1);

  const conduit = await conduitController.getConduit(conduitKeyOne);
  await conduitController.updateChannel(conduit.conduit, seaport.address, true, {
    gasLimit: BigNumber.from(300_000_000),
  });
  console.info(`CONDUIT_ADDR=${conduit.conduit.toLowerCase()}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
