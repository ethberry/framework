import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { utils, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import { IServerSignature } from "@gemunion/types-collection";
import {
  Erc1155TokenTemplate,
  Erc20TokenTemplate,
  Erc20VestingTemplate,
  Erc721TokenTemplate,
  IErc1155CollectionDeployDto,
  IErc20TokenDeployDto,
  IErc20VestingDeployDto,
  IErc721CollectionDeployDto,
} from "@framework/types";

import ERC20Simple from "@framework/binance-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";
import ERC20BlackList from "@framework/binance-contracts/artifacts/contracts/ERC20/ERC20BlackList.sol/ERC20BlackList.json";
import LinearVesting from "@framework/binance-contracts/artifacts/contracts/Vesting/LinearVesting.sol/LinearVesting.json";
import GradedVesting from "@framework/binance-contracts/artifacts/contracts/Vesting/GradedVesting.sol/GradedVesting.json";
import CliffVesting from "@framework/binance-contracts/artifacts/contracts/Vesting/CliffVesting.sol/CliffVesting.json";
import ERC721Simple from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
import ERC721Graded from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Graded.sol/ERC721Graded.json";
import ERC721Random from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Random.sol/ERC721Random.json";
import ERC1155Simple from "@framework/binance-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";

@Injectable()
export class ContractManagerService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
  ) {}

  public async erc20Token(dto: IErc20TokenDeployDto): Promise<IServerSignature> {
    const { contractTemplate, name, symbol, cap } = dto;

    const nonce = utils.randomBytes(32);
    const signature = await this.signer._signTypedData(
      // Domain
      {
        name: "ContractManager",
        version: "1.0.0",
        chainId: ~~this.configService.get<number>("CHAIN_ID", 97),
        verifyingContract: this.configService.get<string>("CONTRACT_MANAGER_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "cap", type: "uint256" },
        ],
      },
      // Value
      {
        nonce,
        bytecode: this.getBytecodeByErc20TokenTemplate(contractTemplate),
        name,
        symbol,
        cap,
      },
    );

    return { nonce: utils.hexlify(nonce), signature };
  }

  public async erc20Vesting(dto: IErc20VestingDeployDto): Promise<IServerSignature> {
    const { contractTemplate, beneficiary, startTimestamp, duration } = dto;
    const nonce = utils.randomBytes(32);
    const signature = await this.signer._signTypedData(
      // Domain
      {
        name: "ContractManager",
        version: "1.0.0",
        chainId: ~~this.configService.get<number>("CHAIN_ID", 97),
        verifyingContract: this.configService.get<string>("CONTRACT_MANAGER_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "beneficiary", type: "address" },
          { name: "startTimestamp", type: "uint64" },
          { name: "duration", type: "uint64" },
          { name: "template", type: "uint8" },
        ],
      },
      // Value
      {
        nonce,
        bytecode: this.getBytecodeByErc20VestingTemplate(contractTemplate),
        beneficiary,
        startTimestamp: Math.floor(new Date(startTimestamp).getTime() / 1000), // in seconds
        duration: duration * 60 * 60 * 24, // in seconds
        template: Object.keys(Erc20VestingTemplate).indexOf(contractTemplate),
      },
    );

    return { nonce: utils.hexlify(nonce), signature };
  }

  public async erc721Token(dto: IErc721CollectionDeployDto): Promise<IServerSignature> {
    const { contractTemplate, name, symbol, royalty, baseTokenURI } = dto;

    const nonce = utils.randomBytes(32);
    const signature = await this.signer._signTypedData(
      // Domain
      {
        name: "ContractManager",
        version: "1.0.0",
        chainId: ~~this.configService.get<number>("CHAIN_ID", 97),
        verifyingContract: this.configService.get<string>("CONTRACT_MANAGER_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "baseTokenURI", type: "string" },
          { name: "royalty", type: "uint96" },
        ],
      },
      // Value
      {
        nonce,
        bytecode: this.getBytecodeByErc721TokenTemplate(contractTemplate),
        name,
        symbol,
        royalty,
        baseTokenURI,
      },
    );

    return { nonce: utils.hexlify(nonce), signature };
  }

  public async erc1155Token(dto: IErc1155CollectionDeployDto): Promise<IServerSignature> {
    const { contractTemplate, baseTokenURI } = dto;

    const nonce = utils.randomBytes(32);
    const signature = await this.signer._signTypedData(
      // Domain
      {
        name: "ContractManager",
        version: "1.0.0",
        chainId: ~~this.configService.get<number>("CHAIN_ID", 97),
        verifyingContract: this.configService.get<string>("CONTRACT_MANAGER_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "baseTokenURI", type: "string" },
        ],
      },
      // Value
      {
        nonce,
        bytecode: this.getBytecodeByErc1155TokenTemplate(contractTemplate),
        baseTokenURI,
      },
    );

    return { nonce: utils.hexlify(nonce), signature };
  }

  public getBytecodeByErc20TokenTemplate(template: Erc20TokenTemplate) {
    switch (template) {
      case Erc20TokenTemplate.SIMPLE:
        return ERC20Simple.bytecode;
      case Erc20TokenTemplate.BLACKLIST:
        return ERC20BlackList.bytecode;
      default:
        throw new Error("Unknown template");
    }
  }

  public getBytecodeByErc20VestingTemplate(template: Erc20VestingTemplate) {
    switch (template) {
      case Erc20VestingTemplate.LINEAR:
        return LinearVesting.bytecode;
      case Erc20VestingTemplate.GRADED:
        return GradedVesting.bytecode;
      case Erc20VestingTemplate.CLIFF:
        return CliffVesting.bytecode;
      default:
        throw new Error("Unknown template");
    }
  }

  public getBytecodeByErc721TokenTemplate(template: Erc721TokenTemplate) {
    switch (template) {
      case Erc721TokenTemplate.SIMPLE:
        return ERC721Simple.bytecode;
      case Erc721TokenTemplate.GRADED:
        return ERC721Graded.bytecode;
      case Erc721TokenTemplate.RANDOM:
        return ERC721Random.bytecode;
      default:
        throw new Error("Unknown template");
    }
  }

  public getBytecodeByErc1155TokenTemplate(template: Erc1155TokenTemplate) {
    switch (template) {
      case Erc1155TokenTemplate.SIMPLE:
        return ERC1155Simple.bytecode;
      default:
        throw new Error("Unknown template");
    }
  }
}
