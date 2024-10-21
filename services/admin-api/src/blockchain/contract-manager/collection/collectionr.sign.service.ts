import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { hexlify, randomBytes, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@ethberry/nest-js-module-ethers-gcp";
import type { IServerSignature } from "@ethberry/types-blockchain";
import type { ICollectionContractDeployDto } from "@framework/types";
import { CollectionContractTemplates, ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { RatePlanService } from "../../../infrastructure/rate-plan/rate-plan.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { getContractABI } from "../utils";

@Injectable()
export class ContractManagerCollectionSignService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly contractService: ContractService,
    private readonly planService: RatePlanService,
  ) {}

  public async collection(dto: ICollectionContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const { bytecode } = await this.getBytecodeByCollectionTemplates(dto, userEntity.chainId);

    await this.planService.validateDeployment(userEntity, ModuleType.COLLECTION, TokenType.ERC721);

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
          { name: "args", type: "CollectionArgs" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "externalId", type: "uint256" },
        ],
        CollectionArgs: [
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "royalty", type: "uint96" },
          { name: "baseTokenURI", type: "string" },
          { name: "batchSize", type: "uint96" },
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
          name: dto.name,
          symbol: dto.symbol,
          royalty: dto.royalty,
          baseTokenURI: dto.baseTokenURI,
          batchSize: dto.batchSize,
          contractTemplate: Object.values(CollectionContractTemplates).indexOf(dto.contractTemplate).toString(),
        },
      },
    );
    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public getBytecodeByCollectionTemplates(dto: ICollectionContractDeployDto, chainId: number) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case CollectionContractTemplates.SIMPLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Collection/ERC721CollectionSimple.sol/ERC721CollectionSimple.json",
          chainId,
        );
      case CollectionContractTemplates.BLACKLIST:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Collection/ERC721CollectionBlacklist.sol/ERC721CollectionBlacklist.json",
          chainId,
        );
      default:
        throw new NotFoundException("templateNotFound");
    }
  }
}
