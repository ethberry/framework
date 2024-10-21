import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ArrayOverlap } from "typeorm";
import { Interface } from "ethers";

import { ContractFeatures, ReferralProgramEventSignature } from "@framework/types";
import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";
import ReferralSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Referral/Referral.sol/Referral.json";

import { ContractType } from "../../../../utils/contract-type";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class ReferralServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async initRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractFeatures: ArrayOverlap([[ContractFeatures.REFERRAL]]),
      chainId,
    });

    return this.updateRegistry(contractEntities.filter(c => c.address !== wallet).map(c => c.address));
  }

  public updateRegistry(address: Array<string>): void {
    this.ethersService.updateRegistry({
      contractType: ContractType.REFERRAL,
      contractAddress: address,
      contractInterface: new Interface(ReferralSol.abi),
      eventSignatures: [ReferralProgramEventSignature.ReferralEvent],
    });
  }
}
