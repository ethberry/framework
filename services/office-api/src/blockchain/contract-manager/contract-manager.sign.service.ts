import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { hexlify, randomBytes, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import type { IServerSignature } from "@gemunion/types-blockchain";
import {
  Erc1155ContractTemplates,
  Erc20ContractTemplates,
  Erc721ContractTemplates,
  IErc1155ContractDeployDto,
  IErc20TokenDeployDto,
  IErc721ContractDeployDto,
  IPyramidContractDeployDto,
  IStakingContractDeployDto,
  IVestingContractDeployDto,
  PyramidContractTemplates,
  StakingContractTemplates,
} from "@framework/types";

import ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";
import ERC20BlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Blacklist.sol/ERC20Blacklist.json";
import ERC20WhitelistSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Whitelist.sol/ERC20Whitelist.json";

import VestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/Vesting.sol/Vesting.json";

import ERC721SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
import ERC721BlackListSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Blacklist.sol/ERC721Blacklist.json";
import ERC721SoulboundSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Soulbound.sol/ERC721Soulbound.json";
import ERC721DiscreteSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Discrete.sol/ERC721Discrete.json";

import ERC1155SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";
import ERC1155BlackListSol from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Blacklist.sol/ERC1155Blacklist.json";

import StakingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Staking/Staking.sol/Staking.json";

import PyramidSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Pyramid/Pyramid.sol/Pyramid.json";
import PyramidReferralSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Pyramid/LinearReferralPyramid.sol/LinearReferralPyramid.json";

import { UserEntity } from "../../infrastructure/user/user.entity";

@Injectable()
export class ContractManagerSignService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
  ) {}

  public async erc20Token(dto: IErc20TokenDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const bytecode = this.getBytecodeByErc20ContractTemplates(dto);

    const params = {
      nonce,
      bytecode,
    };

    const signature = await this.signer.signTypedData(
      // Domain
      {
        name: "ContractManager",
        version: "1.0.0",
        chainId: userEntity.chainId,
        verifyingContract: this.configService.get<string>("CONTRACT_MANAGER_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "params", type: "Params" },
          { name: "args", type: "Erc20Args" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
        ],
        Erc20Args: [
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "cap", type: "uint256" },
          { name: "contractTemplate", type: "string" },
        ],
      },
      // Values
      {
        params,
        args: dto,
      },
    );

    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public async erc721Token(dto: IErc721ContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const bytecode = this.getBytecodeByErc721ContractTemplates(dto);
    const params = {
      nonce,
      bytecode,
    };

    const signature = await this.signer.signTypedData(
      // Domain
      {
        name: "ContractManager",
        version: "1.0.0",
        chainId: userEntity.chainId,
        verifyingContract: this.configService.get<string>("CONTRACT_MANAGER_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "params", type: "Params" },
          { name: "args", type: "Erc721Args" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
        ],
        Erc721Args: [
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "royalty", type: "uint96" },
          { name: "baseTokenURI", type: "string" },
          { name: "contractTemplate", type: "string" },
        ],
      },
      // Values
      {
        params,
        args: dto,
      },
    );
    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public async erc1155Token(dto: IErc1155ContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const bytecode = this.getBytecodeByErc1155ContractTemplates(dto);

    const params = {
      nonce,
      bytecode,
    };

    const signature = await this.signer.signTypedData(
      // Domain
      {
        name: "ContractManager",
        version: "1.0.0",
        chainId: userEntity.chainId,
        verifyingContract: this.configService.get<string>("CONTRACT_MANAGER_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "params", type: "Params" },
          { name: "args", type: "Erc1155Args" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
        ],
        Erc1155Args: [
          { name: "royalty", type: "uint96" },
          { name: "baseTokenURI", type: "string" },
          { name: "contractTemplate", type: "string" },
        ],
      },
      // Values
      {
        params,
        args: dto,
      },
    );

    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  // MODULE:VESTING
  public async vesting(dto: IVestingContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { beneficiary, startTimestamp, cliffInMonth, monthlyRelease } = dto;
    const nonce = randomBytes(32);
    const bytecode = this.getBytecodeByVestingContractTemplate(dto);

    // await this.contractManagerService.validateDeployment(userEntity, ModuleType.VESTING, null);

    const signature = await this.signer.signTypedData(
      // Domain
      {
        name: "ContractManager",
        version: "1.0.0",
        chainId: userEntity.chainId,
        verifyingContract: this.configService.get<string>("CONTRACT_MANAGER_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "params", type: "Params" },
          { name: "args", type: "VestingArgs" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "externalId", type: "uint256" },
        ],
        VestingArgs: [
          { name: "beneficiary", type: "address" },
          { name: "startTimestamp", type: "uint64" },
          { name: "cliffInMonth", type: "uint16" },
          { name: "monthlyRelease", type: "uint16" },
        ],
      },
      // Values
      {
        params: {
          nonce,
          bytecode,
          externalId: userEntity.id,
        },
        args: {
          beneficiary,
          startTimestamp: Math.ceil(new Date(startTimestamp).getTime() / 1000), // in seconds
          cliffInMonth, // in seconds
          monthlyRelease,
        },
      },
    );

    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  // MODULE:PYRAMID
  public async pyramid(dto: IPyramidContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const bytecode = this.getBytecodeByPyramidContractTemplate(dto);

    const params = {
      nonce,
      bytecode,
    };

    const signature = await this.signer.signTypedData(
      // Domain
      {
        name: "ContractManager",
        version: "1.0.0",
        chainId: userEntity.chainId,
        verifyingContract: this.configService.get<string>("CONTRACT_MANAGER_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "params", type: "Params" },
          { name: "args", type: "PyramidArgs" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
        ],
        PyramidArgs: [
          { name: "contractTemplate", type: "string" },
          { name: "payees", type: "address[]" },
          { name: "shares", type: "uint256[]" },
        ],
      },
      // Values
      {
        params,
        args: dto,
      },
    );
    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  // MODULE:STAKING
  public async staking(dto: IStakingContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const bytecode = this.getBytecodeByStakingContractTemplate(dto);

    const params = {
      nonce,
      bytecode,
    };

    const signature = await this.signer.signTypedData(
      // Domain
      {
        name: "ContractManager",
        version: "1.0.0",
        chainId: userEntity.chainId,
        verifyingContract: this.configService.get<string>("CONTRACT_MANAGER_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "params", type: "Params" },
          { name: "args", type: "StakingArgs" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
        ],
        StakingArgs: [
          { name: "contractTemplate", type: "string" },
          { name: "maxStake", type: "uint256" },
        ],
      },
      // Values
      {
        params,
        args: dto,
      },
    );

    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public getBytecodeByErc20ContractTemplates(dto: IErc20TokenDeployDto) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case Erc20ContractTemplates.BLACKLIST:
        return ERC20BlacklistSol.bytecode;
      case Erc20ContractTemplates.WHITELIST:
        return ERC20WhitelistSol.bytecode;
      case Erc20ContractTemplates.SIMPLE:
        return ERC20SimpleSol.bytecode;
      default:
        throw new NotFoundException("templateNotFound");
    }
  }

  public getBytecodeByErc721ContractTemplates(dto: IErc721ContractDeployDto) {
    const { contractTemplate } = dto;
    switch (contractTemplate) {
      case Erc721ContractTemplates.BLACKLIST:
        return ERC721BlackListSol.bytecode;
      case Erc721ContractTemplates.SIMPLE:
        return ERC721SimpleSol.bytecode;
      case Erc721ContractTemplates.SOULBOUND:
        return ERC721SoulboundSol.bytecode;
      case Erc721ContractTemplates.DISCRETE:
        return ERC721DiscreteSol.bytecode;
      default:
        throw new NotFoundException("templateNotFound");
    }
  }

  public getBytecodeByErc1155ContractTemplates(dto: IErc1155ContractDeployDto) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case Erc1155ContractTemplates.SIMPLE:
        return ERC1155SimpleSol.bytecode;
      case Erc1155ContractTemplates.BLACKLIST:
        return ERC1155BlackListSol.bytecode;
      default:
        throw new NotFoundException("templateNotFound");
    }
  }

  // MODULE:VESTING
  public getBytecodeByVestingContractTemplate(_dto: IVestingContractDeployDto) {
    return VestingSol.bytecode;
  }

  public getBytecodeByStakingContractTemplate(dto: IStakingContractDeployDto) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case StakingContractTemplates.SIMPLE:
        return StakingSol.bytecode;
      default:
        throw new NotFoundException("templateNotFound");
    }
  }

  public getBytecodeByPyramidContractTemplate(dto: IPyramidContractDeployDto) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case PyramidContractTemplates.SIMPLE:
        return PyramidSol.bytecode;
      case PyramidContractTemplates.REFERRAL:
        return PyramidReferralSol.bytecode;
      default:
        throw new NotFoundException("templateNotFound");
    }
  }
}
