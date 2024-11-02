import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { hexlify, randomBytes, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@ethberry/nest-js-module-ethers-gcp";
import type { IServerSignature } from "@ethberry/types-blockchain";
import type { IErc721ContractDeployDto } from "@framework/types";
import { Erc721ContractTemplates, ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { RatePlanService } from "../../../infrastructure/rate-plan/rate-plan.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { getContractABI } from "../utils";

@Injectable()
export class ContractManagerErc721SignService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly contractService: ContractService,
    private readonly planService: RatePlanService,
  ) {}

  public async deploy(dto: IErc721ContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const { bytecode } = await this.getBytecodeByErc721ContractTemplates(dto, userEntity.chainId);

    // TODO this 'if' should not be here
    const moduleType =
      dto.contractTemplate === Erc721ContractTemplates.LOTTERY
        ? ModuleType.LOTTERY
        : dto.contractTemplate === Erc721ContractTemplates.RAFFLE
          ? ModuleType.RAFFLE
          : ModuleType.HIERARCHY;
    await this.planService.validateDeployment(userEntity, moduleType, TokenType.ERC721);

    const signature = await this.signer.signTypedData(
      // Domain
      {
        name: ModuleType.CONTRACT_MANAGER,
        version: "1.0.0",
        chainId: userEntity.chainId,
        verifyingContract: await this.contractService
          .findOneOrFail({ contractModule: ModuleType.CONTRACT_MANAGER, chainId: userEntity.chainId })
          .then(({ address }) => address),
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
          { name: "externalId", type: "uint256" },
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
        params: {
          nonce,
          bytecode,
          externalId: userEntity.id,
        },
        args: {
          contractTemplate: Object.values(Erc721ContractTemplates).indexOf(dto.contractTemplate).toString(),
          name: dto.name,
          symbol: dto.symbol,
          baseTokenURI: dto.baseTokenURI,
          royalty: BigInt(dto.royalty),
        },
      },
    );
    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public getBytecodeByErc721ContractTemplates(dto: IErc721ContractDeployDto, chainId: number) {
    const { contractTemplate } = dto;
    switch (contractTemplate) {
      // HIERARCHY
      case Erc721ContractTemplates.BLACKLIST:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Blacklist.sol/ERC721Blacklist.json",
          chainId,
        );
      case Erc721ContractTemplates.SIMPLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json",
          chainId,
        );
      case Erc721ContractTemplates.SOULBOUND:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Soulbound.sol/ERC721Soulbound.json",
          chainId,
        );
      case Erc721ContractTemplates.SOULBOUND_VOTES:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC721/ERC721SoulboundWotes.sol/ERC721SoulboundWotes.json",
          chainId,
        );
      case Erc721ContractTemplates.VOTES:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Wotes.sol/ERC721Wotes.json",
          chainId,
        );

      // MECHANICS
      case Erc721ContractTemplates.DISCRETE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Discrete/ERC721Discrete.sol/ERC721Discrete.json",
          chainId,
        );
      case Erc721ContractTemplates.BLACKLIST_DISCRETE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Discrete/ERC721BlacklistDiscrete.sol/ERC721BlacklistDiscrete.json",
          chainId,
        );

      case Erc721ContractTemplates.GENES:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Genes/networks/ERC721Genes.sol/ERC721Genes.json",
          chainId,
        );

      case Erc721ContractTemplates.BLACKLIST_DISCRETE_RANDOM:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Random/networks/ERC721BlacklistDiscreteRandom.sol/ERC721BlacklistDiscreteRandom.json",
          chainId,
        );
      case Erc721ContractTemplates.BLACKLIST_DISCRETE_RENTABLE_RANDOM:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Random/networks/ERC721BlacklistDiscreteRentableRandom.sol/ERC721BlacklistDiscreteRentableRandom.json",
          chainId,
        );
      case Erc721ContractTemplates.BLACKLIST_RANDOM:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Random/networks/ERC721BlacklistRandom.sol/ERC721BlacklistRandom.json",
          chainId,
        );
      case Erc721ContractTemplates.DISCRETE_RANDOM:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Random/networks/ERC721DiscreteRandom.sol/ERC721DiscreteRandom.json",
          chainId,
        );
      case Erc721ContractTemplates.RANDOM:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Random/networks/ERC721Random.sol/ERC721Random.json",
          chainId,
        );

      case Erc721ContractTemplates.BLACKLIST_DISCRETE_RENTABLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Rentable/ERC721BlacklistDiscreteRentable.sol/ERC721BlacklistDiscreteRentable.json",
          chainId,
        );
      case Erc721ContractTemplates.BLACKLIST_RENTABLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Rentable/ERC721BlacklistRentable.sol/ERC721BlacklistRentable.json",
          chainId,
        );
      case Erc721ContractTemplates.RENTABLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Rentable/ERC721Rentable.sol/ERC721Rentable.json",
          chainId,
        );

      case Erc721ContractTemplates.RAFFLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Raffle/ERC721RaffleTicket.sol/ERC721RaffleTicket.json",
          chainId,
        );

      case Erc721ContractTemplates.LOTTERY:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/ERC721LotteryTicket.sol/ERC721LotteryTicket.json",
          chainId,
        );
      default:
        throw new NotFoundException("templateNotFound");
    }
  }
}
