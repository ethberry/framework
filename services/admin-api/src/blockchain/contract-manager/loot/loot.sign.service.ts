import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { hexlify, randomBytes, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@ethberry/nest-js-module-ethers-gcp";
import type { IServerSignature } from "@ethberry/types-blockchain";
import type { ILootContractDeployDto } from "@framework/types";
import { LootContractTemplates, ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { RatePlanService } from "../../../infrastructure/rate-plan/rate-plan.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { getContractABI } from "../utils";

@Injectable()
export class ContractManagerLootSignService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly contractService: ContractService,
    private readonly planService: RatePlanService,
  ) {}

  public async loot(dto: ILootContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const { bytecode } = await this.getBytecodeByLootContractTemplates(dto, userEntity.chainId);

    await this.planService.validateDeployment(userEntity, ModuleType.LOOT, TokenType.ERC721);

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
          { name: "args", type: "LootArgs" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "externalId", type: "uint256" },
        ],
        LootArgs: [
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
          contractTemplate: Object.values(LootContractTemplates).indexOf(dto.contractTemplate).toString(),
          name: dto.name,
          symbol: dto.symbol,
          baseTokenURI: dto.baseTokenURI,
          royalty: dto.royalty,
        },
      },
    );

    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public getBytecodeByLootContractTemplates(dto: ILootContractDeployDto, chainId: number) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case LootContractTemplates.SIMPLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/LootBox/networks/ERC721LootBoxSimple.sol/ERC721LootBoxSimple.json",
          chainId,
        );
      case LootContractTemplates.PAUSABLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/LootBox/networks/ERC721LootBoxPausable.sol/ERC721LootBoxPausable.json",
          chainId,
        );
      case LootContractTemplates.BLACKLIST:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/LootBox/networks/ERC721LootBoxBlacklist.sol/ERC721LootBoxBlacklist.json",
          chainId,
        );
      case LootContractTemplates.BLACKLIST_PAUSABLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/LootBox/networks/ERC721LootBoxBlacklistPausable.sol/ERC721LootBoxBlacklistPausable.json",
          chainId,
        );
      default:
        throw new NotFoundException("templateNotFound");
    }
  }
}
