import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { hexlify, randomBytes, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@ethberry/nest-js-module-ethers-gcp";
import type { IServerSignature } from "@ethberry/types-blockchain";
import type { IPonziContractDeployDto } from "@framework/types";
import { ModuleType, PonziContractTemplates } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { RatePlanService } from "../../../infrastructure/rate-plan/rate-plan.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { getContractABI } from "../utils";

@Injectable()
export class ContractManagerPonziSignService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly contractService: ContractService,
    private readonly planService: RatePlanService,
  ) {}

  public async deploy(dto: IPonziContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const { bytecode } = await this.getBytecodeByPonziContractTemplate(dto, userEntity.chainId);

    await this.planService.validateDeployment(userEntity, ModuleType.PONZI, null);

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
          { name: "args", type: "PonziArgs" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "externalId", type: "uint256" },
        ],
        PonziArgs: [{ name: "contractTemplate", type: "string" }],
      },
      // Values
      {
        params: {
          nonce,
          bytecode,
          externalId: userEntity.id,
        },
        args: {
          contractTemplate: Object.values(PonziContractTemplates).indexOf(dto.contractTemplate).toString(),
        },
      },
    );
    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public getBytecodeByPonziContractTemplate(dto: IPonziContractDeployDto, chainId: number) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case PonziContractTemplates.SIMPLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Ponzi/Ponzi.sol/Ponzi.json",
          chainId,
        );
      default:
        throw new NotFoundException("templateNotFound");
    }
  }
}
