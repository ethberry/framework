import { ethers } from "hardhat";

import { ERC1155Blacklist } from "../../typechain-types";
import { baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, royalty } from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";

describe("ERC1155Blacklist", function () {
  let erc1155Instance: ERC1155Blacklist;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc1155Factory = await ethers.getContractFactory("ERC1155Blacklist");
    erc1155Instance = await erc1155Factory.deploy(royalty, baseTokenURI);

    this.contractInstance = erc1155Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
});
