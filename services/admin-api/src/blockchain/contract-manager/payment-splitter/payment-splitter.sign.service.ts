import { Inject, Injectable } from "@nestjs/common";
import { hexlify, randomBytes, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@ethberry/nest-js-module-ethers-gcp";
import type { IServerSignature } from "@ethberry/types-blockchain";
import type { IWalletContractDeployDto } from "@framework/types";
import { ModuleType } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { RatePlanService } from "../../../infrastructure/rate-plan/rate-plan.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { getContractABI } from "../utils";

@Injectable()
export class ContractManagerPaymentSplitterSignService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly contractService: ContractService,
    private readonly planService: RatePlanService,
  ) {}

  public async deploy(dto: IWalletContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const { bytecode } = await this.getBytecodeByPaymentSplitterContractTemplate(dto, userEntity.chainId);

    await this.planService.validateDeployment(userEntity, ModuleType.LOTTERY, null);

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
          { name: "args", type: "PaymentSplitterArgs" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "externalId", type: "uint256" },
        ],
        PaymentSplitterArgs: [
          { name: "payees", type: "address[]" },
          { name: "shares", type: "uint256[]" },
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
          payees: dto.payees,
          shares: dto.shares,
        },
      },
    );

    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public getBytecodeByPaymentSplitterContractTemplate(_dto: IWalletContractDeployDto, chainId: number) {
    return getContractABI(
      "@framework/core-contracts/artifacts/@ethberry/contracts-finance/contracts/SplitterWallet.sol/SplitterWallet.json",
      chainId,
    );
  }
}
