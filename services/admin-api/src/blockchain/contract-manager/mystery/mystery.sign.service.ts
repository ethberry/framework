import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { hexlify, randomBytes, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@ethberry/nest-js-module-ethers-gcp";
import type { IServerSignature } from "@ethberry/types-blockchain";
import type { IMysteryContractDeployDto } from "@framework/types";
import { ModuleType, MysteryContractTemplates, TokenType } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { RatePlanService } from "../../../infrastructure/rate-plan/rate-plan.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { getContractABI } from "../utils";

@Injectable()
export class ContractManagerMysterySignService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly contractService: ContractService,
    private readonly planService: RatePlanService,
  ) {}

  public async deploy(dto: IMysteryContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const { bytecode } = await this.getBytecodeByMysteryContractTemplates(dto, userEntity.chainId);

    await this.planService.validateDeployment(userEntity, ModuleType.MYSTERY, TokenType.ERC721);

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
          { name: "args", type: "MysteryArgs" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "externalId", type: "uint256" },
        ],
        MysteryArgs: [
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
          contractTemplate: Object.values(MysteryContractTemplates).indexOf(dto.contractTemplate).toString(),
          name: dto.name,
          symbol: dto.symbol,
          baseTokenURI: dto.baseTokenURI,
          royalty: dto.royalty,
        },
      },
    );

    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public getBytecodeByMysteryContractTemplates(dto: IMysteryContractDeployDto, chainId: number) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case MysteryContractTemplates.SIMPLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/MysteryBox/ERC721MysteryBoxSimple.sol/ERC721MysteryBoxSimple.json",
          chainId,
        );
      case MysteryContractTemplates.PAUSABLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/MysteryBox/ERC721MysteryBoxPausable.sol/ERC721MysteryBoxPausable.json",
          chainId,
        );
      case MysteryContractTemplates.BLACKLIST:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/MysteryBox/ERC721MysteryBoxBlacklist.sol/ERC721MysteryBoxBlacklist.json",
          chainId,
        );
      case MysteryContractTemplates.BLACKLIST_PAUSABLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/MysteryBox/ERC721MysteryBoxBlacklistPausable.sol/ERC721MysteryBoxBlacklistPausable.json",
          chainId,
        );
      default:
        throw new NotFoundException("templateNotFound");
    }
  }
}
