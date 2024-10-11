import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ContractFeatures, ReferralProgramEventSignature } from "@framework/types";
import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { testChainId } from "@framework/constants";

import { ContractType } from "../../../../utils/contract-type";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ReferralABI } from "./interfaces";

@Injectable()
export class ReferralServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async updateRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractFeatures: ContractFeatures.REFERRAL,
      chainId,
    });

    return this.ethersService.updateRegistry({
      contractType: ContractType.REFERRAL,
      contractAddress: contractEntities.filter(c => c.address !== wallet).map(c => c.address),
      contractInterface: ReferralABI,
      eventSignatures: [ReferralProgramEventSignature.ReferralEvent],
    });
  }

  public updateRegistryAndReadBlock(address: Array<string>, blockNumber: number): Promise<void> {
    return this.ethersService.updateRegistryAndReadBlock(
      {
        contractType: ContractType.REFERRAL,
        contractAddress: address,
        contractInterface: ReferralABI,
        eventSignatures: [ReferralProgramEventSignature.ReferralEvent],
      },
      blockNumber,
    );
  }
}
