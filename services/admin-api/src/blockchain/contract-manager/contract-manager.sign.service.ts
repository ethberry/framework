import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { utils, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import { IServerSignature } from "@gemunion/types-collection";
import {
  Erc1155ContractTemplate,
  Erc20ContractTemplate,
  Erc721ContractTemplate,
  IContractDeployDto,
  IErc20TokenDeployDto,
  IVestingDeployDto,
  IErc721ContractDeployDto,
  VestingTemplate,
} from "@framework/types";

import ERC20Simple from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";
import ERC20BlackList from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20BlackList.sol/ERC20BlackList.json";
import LinearVesting from "@framework/core-contracts/artifacts/contracts/Vesting/LinearVesting.sol/LinearVesting.json";
import GradedVesting from "@framework/core-contracts/artifacts/contracts/Vesting/GradedVesting.sol/GradedVesting.json";
import CliffVesting from "@framework/core-contracts/artifacts/contracts/Vesting/CliffVesting.sol/CliffVesting.json";
import ERC721Simple from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
import ERC721Graded from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Graded.sol/ERC721Graded.json";
import ERC721RandomTest from "@framework/core-contracts/artifacts/contracts/ERC721/test/ERC721RandomTest.sol/ERC721RandomTest.json";
// import ERC721Random from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Random.sol/ERC721Random.json";
import ERC1155Simple from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";

@Injectable()
export class ContractManagerSignService {
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
        chainId: ~~this.configService.get<string>("CHAIN_ID", "1337"),
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
          { name: "templateId", type: "uint256" },
        ],
      },
      // Value
      {
        nonce,
        bytecode: this.getBytecodeByErc20ContractTemplate(contractTemplate),
        name,
        symbol,
        cap,
        templateId: Object.keys(Erc20ContractTemplate).indexOf(contractTemplate),
      },
    );

    return { nonce: utils.hexlify(nonce), signature };
  }

  public async erc20Vesting(dto: IVestingDeployDto): Promise<IServerSignature> {
    const { contractTemplate, beneficiary, startTimestamp, duration } = dto;
    const nonce = utils.randomBytes(32);
    const signature = await this.signer._signTypedData(
      // Domain
      {
        name: "ContractManager",
        version: "1.0.0",
        chainId: ~~this.configService.get<string>("CHAIN_ID", "1337"),
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
          { name: "templateId", type: "uint256" },
        ],
      },
      // Value
      {
        nonce,
        bytecode: this.getBytecodeByErc20VestingTemplate(contractTemplate),
        beneficiary,
        startTimestamp: Math.floor(new Date(startTimestamp).getTime() / 1000), // in seconds
        duration: duration * 60 * 60 * 24, // in seconds
        templateId: Object.keys(VestingTemplate).indexOf(contractTemplate),
      },
    );

    return { nonce: utils.hexlify(nonce), signature };
  }

  public async erc721Token(dto: IErc721ContractDeployDto): Promise<IServerSignature> {
    const { contractTemplate, name, symbol, royalty, baseTokenURI } = dto;

    const nonce = utils.randomBytes(32);
    const signature = await this.signer._signTypedData(
      // Domain
      {
        name: "ContractManager",
        version: "1.0.0",
        chainId: ~~this.configService.get<string>("CHAIN_ID", "1337"),
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
          { name: "templateId", type: "uint256" },
        ],
      },
      // Value
      {
        nonce,
        bytecode: this.getBytecodeByErc721ContractTemplate(contractTemplate),
        name,
        symbol,
        baseTokenURI,
        royalty,
        templateId: Object.keys(Erc721ContractTemplate).indexOf(contractTemplate),
      },
    );

    return { nonce: utils.hexlify(nonce), signature };
  }

  public async erc1155Token(dto: IContractDeployDto): Promise<IServerSignature> {
    const { contractTemplate, baseTokenURI } = dto;

    const nonce = utils.randomBytes(32);
    const signature = await this.signer._signTypedData(
      // Domain
      {
        name: "ContractManager",
        version: "1.0.0",
        chainId: ~~this.configService.get<string>("CHAIN_ID", "1337"),
        verifyingContract: this.configService.get<string>("CONTRACT_MANAGER_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "baseTokenURI", type: "string" },
          { name: "templateId", type: "uint256" },
        ],
      },
      // Value
      {
        nonce,
        bytecode: this.getBytecodeByErc1155ContractTemplate(contractTemplate),
        baseTokenURI,
        templateId: Object.keys(Erc1155ContractTemplate).indexOf(contractTemplate),
      },
    );

    return { nonce: utils.hexlify(nonce), signature };
  }

  public getBytecodeByErc20ContractTemplate(contractTemplate: Erc20ContractTemplate) {
    switch (contractTemplate) {
      case Erc20ContractTemplate.SIMPLE:
        return ERC20Simple.bytecode;
      case Erc20ContractTemplate.BLACKLIST:
        return ERC20BlackList.bytecode;
      default:
        throw new Error("Unknown template");
    }
  }

  public getBytecodeByErc20VestingTemplate(contractTemplate: VestingTemplate) {
    switch (contractTemplate) {
      case VestingTemplate.LINEAR:
        return LinearVesting.bytecode;
      case VestingTemplate.GRADED:
        return GradedVesting.bytecode;
      case VestingTemplate.CLIFF:
        return CliffVesting.bytecode;
      default:
        throw new Error("Unknown template");
    }
  }

  public getBytecodeByErc721ContractTemplate(contractTemplate: Erc721ContractTemplate) {
    switch (contractTemplate) {
      case Erc721ContractTemplate.SIMPLE:
        return ERC721Simple.bytecode;
      case Erc721ContractTemplate.GRADED:
        return ERC721Graded.bytecode;
      case Erc721ContractTemplate.RANDOM:
        return ERC721RandomTest.bytecode;
      // return ERC721Random.bytecode;
      default:
        throw new Error("Unknown template");
    }
  }

  public getBytecodeByErc1155ContractTemplate(contractTemplate: Erc1155ContractTemplate) {
    switch (contractTemplate) {
      case Erc1155ContractTemplate.SIMPLE:
        return ERC1155Simple.bytecode;
      default:
        throw new Error("Unknown template");
    }
  }
}
