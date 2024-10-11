import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { hexlify, randomBytes, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@ethberry/nest-js-module-ethers-gcp";
import type { IServerSignature } from "@ethberry/types-blockchain";
import type { IErc998ContractDeployDto } from "@framework/types";
import { Erc998ContractTemplates, ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { RatePlanService } from "../../../infrastructure/rate-plan/rate-plan.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { getContractABI } from "../utils";

@Injectable()
export class ContractManagerErc998SignService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly contractService: ContractService,
    private readonly planService: RatePlanService,
  ) {}

  public async erc998Token(dto: IErc998ContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const { bytecode } = await this.getBytecodeByErc998ContractTemplates(dto, userEntity.chainId);

    await this.planService.validateDeployment(userEntity, ModuleType.HIERARCHY, TokenType.ERC998);

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
          { name: "args", type: "Erc998Args" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "externalId", type: "uint256" },
        ],
        Erc998Args: [
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
          contractTemplate: Object.values(Erc998ContractTemplates).indexOf(dto.contractTemplate).toString(),
          name: dto.name,
          symbol: dto.symbol,
          baseTokenURI: dto.baseTokenURI,
          royalty: dto.royalty,
        },
      },
    );

    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public getBytecodeByErc998ContractTemplates(dto: IErc998ContractDeployDto, chainId: number) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      // HIERARCHY
      case Erc998ContractTemplates.BLACKLIST:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Blacklist.sol/ERC998Blacklist.json",
          chainId,
        );
      case Erc998ContractTemplates.ERC20OWNER:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC998/ERC998ERC20Simple.sol/ERC998ERC20Simple.json",
          chainId,
        );
      case Erc998ContractTemplates.ERC1155OWNER:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC998/ERC998ERC1155Simple.sol/ERC998ERC1155Simple.json",
          chainId,
        );
      case Erc998ContractTemplates.ERC1155OWNER_ERC20OWNER:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC998/ERC998ERC1155ERC20Simple.sol/ERC998ERC1155ERC20Simple.json",
          chainId,
        );
      case Erc998ContractTemplates.SIMPLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Simple.sol/ERC998Simple.json",
          chainId,
        );
      case Erc998ContractTemplates.STATEHASH:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC998/ERC998StateHash.sol/ERC998StateHash.json",
          chainId,
        );

      // MECHANICS
      case Erc998ContractTemplates.DISCRETE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Discrete/ERC998Discrete.sol/ERC998Discrete.json",
          chainId,
        );
      case Erc998ContractTemplates.BLACKLIST_DISCRETE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC998/ERC998BlacklistDiscrete.sol/ERC998BlacklistDiscrete.json",
          chainId,
        );

      case Erc998ContractTemplates.GENES:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Genes/networks/ERC998Genes.sol/ERC998Genes.json",
          chainId,
        );

      case Erc998ContractTemplates.BLACKLIST_RANDOM:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Random/networks/ERC998BlacklistRandom.sol/ERC998BlacklistRandom.json",
          chainId,
        );
      case Erc998ContractTemplates.BLACKLIST_DISCRETE_RANDOM:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Random/networks/ERC998BlacklistDiscreteRandom.sol/ERC998BlacklistDiscreteRandom.json",
          chainId,
        );
      case Erc998ContractTemplates.DISCRETE_RANDOM:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Random/networks/ERC998DiscreteRandom.sol/ERC998DiscreteRandom.json",
          chainId,
        );
      case Erc998ContractTemplates.RANDOM:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Random/networks/ERC998Random.sol/ERC998Random.json",
          chainId,
        );

      case Erc998ContractTemplates.RENTABLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Rentable/networks/ERC998Rentable.sol/ERC998Rentable.json",
          chainId,
        );

      default:
        throw new NotFoundException("templateNotFound");
    }
  }
}
