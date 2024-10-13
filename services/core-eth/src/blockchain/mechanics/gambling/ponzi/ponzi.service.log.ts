import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IsNull } from "typeorm";

import { EthersService } from "@ethberry/nest-js-module-ethers-gcp";
import { wallet } from "@ethberry/constants";
import { ModuleType, PonziEventSignature } from "@framework/types";
import { testChainId } from "@framework/constants";

import { ContractType } from "../../../../utils/contract-type";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { PonziABI } from "./interfaces";

@Injectable()
export class PonziServiceLog {
  constructor(
    protected readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly ethersService: EthersService,
  ) {}

  public async initRegistry(): Promise<void> {
    const chainId = ~~this.configService.get<string>("CHAIN_ID", String(testChainId));
    const contractEntities = await this.contractService.findAll({
      contractModule: ModuleType.PONZI,
      contractType: IsNull(),
      chainId,
    });

    return this.updateRegistry(contractEntities.filter(c => c.address !== wallet).map(c => c.address));
  }

  public updateRegistry(address: Array<string>): void {
    this.ethersService.updateRegistry({
      contractType: ContractType.PONZI,
      contractAddress: address,
      contractInterface: PonziABI,
      eventSignatures: [
        PonziEventSignature.RuleCreatedP,
        PonziEventSignature.RuleUpdated,
        PonziEventSignature.StakingStart,
        PonziEventSignature.StakingWithdraw,
        PonziEventSignature.StakingFinish,
        PonziEventSignature.FinalizedToken,
        PonziEventSignature.WithdrawToken,
      ],
    });
  }
}
