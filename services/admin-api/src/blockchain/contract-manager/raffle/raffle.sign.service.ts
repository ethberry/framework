import { Inject, Injectable } from "@nestjs/common";
import { hexlify, randomBytes, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@ethberry/nest-js-module-ethers-gcp";
import type { IServerSignature } from "@ethberry/types-blockchain";
import { ModuleType } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { RatePlanService } from "../../../infrastructure/rate-plan/rate-plan.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { getContractABI } from "../utils";

@Injectable()
export class ContractManagerRaffleSignService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly contractService: ContractService,
    private readonly planService: RatePlanService,
  ) {}

  public async deploy(userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const { bytecode } = await this.getBytecodeByRaffleContractTemplate(userEntity.chainId);

    await this.planService.validateDeployment(userEntity, ModuleType.RAFFLE, null);

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
        EIP712: [{ name: "params", type: "Params" }],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "externalId", type: "uint256" },
        ],
      },
      // Values
      {
        params: {
          nonce,
          bytecode,
          externalId: userEntity.id,
        },
      },
    );

    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public getBytecodeByRaffleContractTemplate(chainId: number) {
    return getContractABI(
      "@framework/core-contracts/artifacts/contracts/Mechanics/Raffle/networks/Raffle.sol/Raffle.json",
      chainId,
    );
  }
}