import { expect } from "chai";
import { ethers } from "hardhat";

import {
  amount,
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  royalty,
  tokenName,
  tokenSymbol,
} from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl } from "@gemunion/contracts-mocha";

import { deployERC20 } from "../../ERC20/shared/fixtures";
import { deployERC721 } from "../../ERC721/shared/fixtures";
import { shouldBehaveLikeERC721Simple } from "../../ERC721/shared/simple";
import { deployERC1155 } from "../../ERC1155/shared/fixtures";
import { constants } from "ethers";

describe("Wrapper", function () {
  const erc721WrapperFactory = () => deployERC721("ERC721TokenWrapperTest");
  const erc20Factory = () => deployERC20();
  const erc721Factory = () => deployERC721();
  const erc1155Factory = () => deployERC1155();
  const erc998Factory = async () => {
    const _erc998Factory = await ethers.getContractFactory("ERC998Simple");
    return _erc998Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
  };
  const wrapperWalletFactory = async () => (await ethers.getContractFactory("WrapperMock")).deploy();

  shouldBehaveLikeAccessControl(erc721WrapperFactory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldBehaveLikeERC721Simple(erc721WrapperFactory);

  it("should wrap NATIVE and unwrap NATIVE", async function () {
    const [owner] = await ethers.getSigners();

    const erc721WrapperInstance = await erc721WrapperFactory();

    const items = [
      {
        tokenType: 0,
        token: constants.AddressZero,
        tokenId: 0,
        amount,
      },
    ];

    const tx = erc721WrapperInstance.mintBox(owner.address, 1, items, { value: amount });
    await expect(tx).to.changeEtherBalance(owner, -amount);

    const tx1 = erc721WrapperInstance.unpack(1);
    await expect(tx1).to.changeEtherBalance(owner, amount);
  });

  it("should wrap ERC20 and unwrap ERC20", async function () {
    const [owner] = await ethers.getSigners();

    const erc20Instance = await erc20Factory();
    const erc721WrapperInstance = await erc721WrapperFactory();

    await erc20Instance.mint(owner.address, amount);
    await erc20Instance.approve(erc721WrapperInstance.address, amount);

    const items = [
      {
        tokenType: 1,
        token: erc20Instance.address,
        tokenId: 0,
        amount,
      },
    ];

    const tx = erc721WrapperInstance.mintBox(owner.address, 1, items);
    await expect(tx).to.emit(erc20Instance, "Transfer");
    await expect(tx).to.changeTokenBalance(erc20Instance, owner, -amount);

    const tx1 = erc721WrapperInstance.unpack(1);
    await expect(tx1).to.emit(erc20Instance, "Transfer");
    await expect(tx1).to.changeTokenBalance(erc20Instance, owner, amount);
  });

  it("should wrap ERC20 and unwrap ERC20 on Contract. Emit ERC1363 TransferReceived", async function () {
    const [owner] = await ethers.getSigners();

    const erc20Instance = await erc20Factory();
    const erc721WrapperInstance = await erc721WrapperFactory();
    const wrapperWalletInstance = await wrapperWalletFactory();

    await erc20Instance.mint(owner.address, amount);
    await erc20Instance.approve(erc721WrapperInstance.address, amount);

    const items = [
      {
        tokenType: 1,
        token: erc20Instance.address,
        tokenId: 0,
        amount,
      },
    ];

    const tx = erc721WrapperInstance.mintBox(wrapperWalletInstance.address, 1, items);
    await expect(tx).to.emit(erc20Instance, "Transfer");
    await expect(tx).to.changeTokenBalance(erc20Instance, owner, -amount);

    // Calling WrapperWalletMock.unpack
    const tx1 = wrapperWalletInstance.unpack(erc721WrapperInstance.address, 1);
    await expect(tx1).to.emit(erc20Instance, "Transfer");
    await expect(tx1).to.emit(wrapperWalletInstance, "TransferReceived");
    await expect(tx1).to.changeTokenBalance(erc20Instance, wrapperWalletInstance.address, amount);
  });

  it("should wrap ERC721 and unwrap ERC721", async function () {
    const [owner] = await ethers.getSigners();

    const erc721Instance = await erc721Factory();
    const erc721WrapperInstance = await erc721WrapperFactory();

    await erc721Instance.mintCommon(owner.address, 1);
    await erc721Instance.setApprovalForAll(erc721WrapperInstance.address, true);

    const items = [
      {
        tokenType: 2,
        token: erc721Instance.address,
        tokenId: 1,
        amount,
      },
    ];

    await erc721WrapperInstance.mintBox(owner.address, 1, items);
    const balanace = await erc721Instance.balanceOf(erc721WrapperInstance.address);
    expect(balanace).to.be.equal(1);

    await erc721WrapperInstance.unpack(1);
    const balanace2 = await erc721Instance.balanceOf(erc721WrapperInstance.address);
    expect(balanace2).to.be.equal(0);
  });

  it("should wrap ERC998 and unwrap ERC998", async function () {
    const [owner] = await ethers.getSigners();

    const erc998Instance = await erc998Factory();
    const erc721WrapperInstance = await erc721WrapperFactory();

    await erc998Instance.mintCommon(owner.address, 1);
    await erc998Instance.setApprovalForAll(erc721WrapperInstance.address, true);

    const items = [
      {
        tokenType: 3,
        token: erc998Instance.address,
        tokenId: 1,
        amount,
      },
    ];

    await erc721WrapperInstance.mintBox(owner.address, 1, items);
    const balanace = await erc998Instance.balanceOf(erc721WrapperInstance.address);
    expect(balanace).to.be.equal(1);

    await erc721WrapperInstance.unpack(1);
    const balanace2 = await erc998Instance.balanceOf(erc721WrapperInstance.address);
    expect(balanace2).to.be.equal(0);
  });

  it("should wrap ERC1155 and unwrap ERC1155", async function () {
    const [owner] = await ethers.getSigners();

    const erc1155Instance = await erc1155Factory();
    const erc721WrapperInstance = await erc721WrapperFactory();

    await erc1155Instance.mint(owner.address, 1, amount, "0x");
    await erc1155Instance.setApprovalForAll(erc721WrapperInstance.address, true);

    const items = [
      {
        tokenType: 4,
        token: erc1155Instance.address,
        tokenId: 1,
        amount,
      },
    ];

    await erc721WrapperInstance.mintBox(owner.address, 1, items);
    const balanace = await erc1155Instance.balanceOf(erc721WrapperInstance.address, 1);
    expect(balanace).to.be.equal(amount);

    await erc721WrapperInstance.unpack(1);
    const balanace2 = await erc1155Instance.balanceOf(erc721WrapperInstance.address, 1);
    expect(balanace2).to.be.equal(0);
  });

  it("should wrap NATIVE & ERC20 and unwrap NATIVE & ERC20", async function () {
    const [owner] = await ethers.getSigners();

    const erc721WrapperInstance = await erc721WrapperFactory();

    const erc20Instance = await erc20Factory();

    await erc20Instance.mint(owner.address, amount);
    await erc20Instance.approve(erc721WrapperInstance.address, amount);

    const items = [
      {
        tokenType: 0,
        token: constants.AddressZero,
        tokenId: 1,
        amount,
      },
      {
        tokenType: 1,
        token: erc20Instance.address,
        tokenId: 1,
        amount,
      },
    ];

    const tx = await erc721WrapperInstance.mintBox(owner.address, 1, items, { value: amount });
    await expect(tx).to.changeTokenBalance(erc20Instance, owner, -amount);
    await expect(tx).to.changeEtherBalance(owner, -amount);

    const tx1 = await erc721WrapperInstance.unpack(1);
    await expect(tx1).to.changeTokenBalance(erc20Instance, owner, amount);
    await expect(tx1).to.changeEtherBalance(owner, amount);
  });

  it("should wrap NATIVE, ERC20 & ERC721 & ERC998 & ERC1155 and unwrap NATIVE, ERC20 & ERC721  & ERC998 & ERC1155", async function () {
    const [owner] = await ethers.getSigners();

    const erc721WrapperInstance = await erc721WrapperFactory();

    const erc20Instance = await erc20Factory();
    const erc721Instance = await erc721Factory();
    const erc1155Instance = await erc1155Factory();
    const erc998Instance = await erc998Factory();

    await erc20Instance.mint(owner.address, amount);
    await erc20Instance.approve(erc721WrapperInstance.address, amount);

    await erc721Instance.mintCommon(owner.address, 1);
    await erc721Instance.setApprovalForAll(erc721WrapperInstance.address, true);

    await erc1155Instance.mint(owner.address, 1, amount, "0x");
    await erc1155Instance.setApprovalForAll(erc721WrapperInstance.address, true);

    await erc998Instance.mintCommon(owner.address, 1);
    await erc998Instance.setApprovalForAll(erc721WrapperInstance.address, true);

    const items = [
      {
        tokenType: 0,
        token: constants.AddressZero,
        tokenId: 1,
        amount,
      },
      {
        tokenType: 1,
        token: erc20Instance.address,
        tokenId: 1,
        amount,
      },
      {
        tokenType: 2,
        token: erc721Instance.address,
        tokenId: 1,
        amount,
      },
      {
        tokenType: 3,
        token: erc998Instance.address,
        tokenId: 1,
        amount,
      },
      {
        tokenType: 4,
        token: erc1155Instance.address,
        tokenId: 1,
        amount,
      },
    ];

    const balanace01 = await erc1155Instance.balanceOf(owner.address, 1);
    expect(balanace01).to.be.equal(amount);
    const balanace02 = await erc721Instance.balanceOf(owner.address);
    expect(balanace02).to.be.equal(1);
    const balanace03 = await erc998Instance.balanceOf(owner.address);
    expect(balanace03).to.be.equal(1);

    const tx1 = erc721WrapperInstance.mintBox(owner.address, 1, items, { value: amount });
    await expect(tx1).to.changeTokenBalance(erc20Instance, owner, -amount);
    await expect(tx1).to.changeEtherBalance(owner, -amount);
    const balanace11 = await erc721Instance.balanceOf(owner.address);
    expect(balanace11).to.be.equal(0);
    const balanace12 = await erc998Instance.balanceOf(owner.address);
    expect(balanace12).to.be.equal(0);
    const balanace13 = await erc1155Instance.balanceOf(owner.address, 1);
    expect(balanace13).to.be.equal(0);

    const tx2 = erc721WrapperInstance.unpack(1);
    await expect(tx2).to.changeTokenBalance(erc20Instance, owner, amount);
    await expect(tx2).to.changeEtherBalance(owner, amount);
    const balanace21 = await erc721Instance.balanceOf(owner.address);
    expect(balanace21).to.be.equal(1);
    const balanace22 = await erc998Instance.balanceOf(owner.address);
    expect(balanace22).to.be.equal(1);
    const balanace23 = await erc1155Instance.balanceOf(owner.address, 1);
    expect(balanace23).to.be.equal(amount);
  });
});
