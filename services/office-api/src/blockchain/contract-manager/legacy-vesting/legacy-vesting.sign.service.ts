import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { hexlify, randomBytes, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@ethberry/nest-js-module-ethers-gcp";
import type { IServerSignature } from "@ethberry/types-blockchain";
import type { ILegacyVestingContractDeployDto } from "@framework/types";
import { ModuleType, LegacyVestingContractTemplates } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { RatePlanService } from "../../../infrastructure/rate-plan/rate-plan.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { getContractABI } from "../utils";

@Injectable()
export class ContractManagerVestingSignService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly contractService: ContractService,
    private readonly planService: RatePlanService,
  ) {}

  public async deploy(dto: ILegacyVestingContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { owner, startTimestamp, cliffInMonth, monthlyRelease, contractTemplate } = dto;

    const nonce = randomBytes(32);
    const { bytecode } = await this.getBytecodeByVestingContractTemplate(dto, userEntity.chainId);

    await this.planService.validateDeployment(userEntity, ModuleType.LEGACY_VESTING, null);

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
      },
      // Values
      {
        params: {
          nonce,
          bytecode,
          externalId: userEntity.id,
        },
        args: {
          owner: owner.toLowerCase(),
          startTimestamp: Math.ceil(new Date(startTimestamp).getTime() / 1000), // in seconds
          cliffInMonth, // in seconds
          monthlyRelease,
          contractTemplate: Object.values(LegacyVestingContractTemplates).indexOf(contractTemplate).toString(),
        },
      },
    );

    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public getBytecodeByVestingContractTemplate(dto: ILegacyVestingContractDeployDto, chainId: number) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case LegacyVestingContractTemplates.VESTING:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/LegacyVesting/LegacyVesting.sol/LegacyVesting.json",
          chainId,
        );
      case LegacyVestingContractTemplates.VESTING_VOTES:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/LegacyVesting/LegacyVestingVotes.sol/LegacyVestingVotes.json",
          chainId,
        );
      default:
        throw new NotFoundException("templateNotFound");
    }
  }
}