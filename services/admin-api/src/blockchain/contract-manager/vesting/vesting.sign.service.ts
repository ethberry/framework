import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { hexlify, randomBytes, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@ethberry/nest-js-module-ethers-gcp";
import type { IServerSignature } from "@ethberry/types-blockchain";
import type { IVestingContractDeployDto } from "@framework/types";
import { ModuleType, TokenType, VestingContractTemplates } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { RatePlanService } from "../../../infrastructure/rate-plan/rate-plan.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { AssetEntity } from "../../exchange/asset/asset.entity";
import { getContractABI } from "../utils";

@Injectable()
export class ContractManagerVestingSignService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly contractService: ContractService,
    private readonly planService: RatePlanService,
  ) {}

  public async vesting(
    dto: IVestingContractDeployDto,
    userEntity: UserEntity,
    asset?: AssetEntity,
  ): Promise<IServerSignature> {
    const { owner, startTimestamp, cliffInMonth, monthlyRelease, externalId, contractTemplate } = dto;

    const nonce = randomBytes(32);
    const { bytecode } = await this.getBytecodeByVestingContractTemplate(dto, userEntity.chainId);

    await this.planService.validateDeployment(userEntity, ModuleType.VESTING, null);

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
          { name: "args", type: "VestingArgs" },
          { name: "items", type: "Asset[]" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "externalId", type: "uint256" },
        ],
        VestingArgs: [
          { name: "owner", type: "address" },
          { name: "startTimestamp", type: "uint64" },
          { name: "cliffInMonth", type: "uint16" },
          { name: "monthlyRelease", type: "uint16" },
          { name: "contractTemplate", type: "string" },
        ],
        Asset: [
          { name: "tokenType", type: "uint256" },
          { name: "token", type: "address" },
          { name: "tokenId", type: "uint256" },
          { name: "amount", type: "uint256" },
        ],
      },
      // Values
      {
        params: {
          nonce,
          bytecode,
          externalId: externalId || userEntity.id,
        },
        args: {
          owner: owner.toLowerCase(),
          startTimestamp: Math.ceil(new Date(startTimestamp).getTime() / 1000), // in seconds
          cliffInMonth, // in seconds
          monthlyRelease,
          contractTemplate: Object.values(VestingContractTemplates).indexOf(contractTemplate).toString(),
        },
        // items: [],
        items: asset
          ? asset.components.map(component => ({
              tokenType: Object.values(TokenType).indexOf(component.tokenType),
              token: component.template.contract.address,
              tokenId: (component.templateId || 0).toString(), // suppression types check with 0
              amount: component.amount,
            }))
          : [],
      },
    );

    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public getBytecodeByVestingContractTemplate(dto: IVestingContractDeployDto, chainId: number) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case VestingContractTemplates.VESTING:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/Vesting.sol/Vesting.json",
          chainId,
        );
      case VestingContractTemplates.VESTING_VOTES:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/VestingVotes.sol/VestingVotes.json",
          chainId,
        );
      default:
        throw new NotFoundException("templateNotFound");
    }
  }
}
