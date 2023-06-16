import { ethers } from "hardhat";
import { FacetCutAction, getSelectors } from "../shared/diamond";
import { Contract } from "ethers";

export async function deployDiamond(log = false): Promise<Contract> {
  const [owner] = await ethers.getSigners();

  // deploy DiamondCutFacet
  const DiamondCutFacet = await ethers.getContractFactory("DiamondCutFacet");
  const diamondCutFacet = await DiamondCutFacet.deploy();
  await diamondCutFacet.deployed();
  if (log) console.info("DiamondCutFacet deployed:", diamondCutFacet.address);

  // deploy Diamond
  const Diamond = await ethers.getContractFactory("Diamond");
  const diamond = await Diamond.deploy(owner.address, diamondCutFacet.address);
  await diamond.deployed();
  if (log) console.info("Diamond deployed:", diamond.address);

  // deploy DiamondInit
  // DiamondInit provides a function that is called when the diamond is upgraded to initialize state variables
  // Read about how the diamondCut function works here: https://eips.ethereum.org/EIPS/eip-2535#addingreplacingremoving-functions
  // * diamondInit
  const DiamondInit = await ethers.getContractFactory("InitFacetTest");
  const diamondInit = await DiamondInit.deploy();
  await diamondInit.deployed();
  // if (log) console.info("DiamondInit deployed:", diamondInit.address);

  // * deploy facets
  if (log) console.info("");
  if (log) console.info("Deploying facets");
  const FacetNames = ["ExchangePurchaseFacet"];
  const cut = [];
  for (const FacetName of FacetNames) {
    const Facet = await ethers.getContractFactory(FacetName);
    const facet = await Facet.deploy();
    await facet.deployed();
    if (log) console.info(`${FacetName} deployed: ${facet.address}`);
    cut.push({
      facetAddress: facet.address,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facet),
    });
  }

  // upgrade diamond with facets
  if (log) console.info("");
  if (log) console.info("Diamond Cut:", cut);
  const diamondCut = await ethers.getContractAt("IDiamondCut", diamond.address);
  // call to init function
  const functionCall = diamondInit.interface.encodeFunctionData("init");
  const tx = await diamondCut.diamondCut(cut, diamondInit.address, functionCall);
  // const tx = await diamondCut.diamondCut(cut, constants.AddressZero, "0x");
  if (log) console.info("Diamond cut tx: ", tx.hash);
  const receipt = await tx.wait();
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`);
  }
  if (log) console.info("Completed diamond cut");
  return diamond;
}
