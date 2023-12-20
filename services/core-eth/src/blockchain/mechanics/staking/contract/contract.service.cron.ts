import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Cron } from "@nestjs/schedule";

import { CronExpression, ModuleType, RmqProviderType } from "@framework/types";
import { StakingDepositServiceEth } from "../deposit/deposit.service.eth";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class StakingContractServiceCron {
  private cronLock;

  constructor(
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly stakingDepositServiceEth: StakingDepositServiceEth,
    private readonly contractService: ContractService,
  ) {
    this.cronLock = false; // lock cron jobs while processing
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async balanceCheck(): Promise<void> {
    // CHECK CRON LOCK
    if (this.cronLock) {
      return;
    }
    this.cronLock = true;

    const allStakingContracts = await this.contractService.findAll({ contractModule: ModuleType.STAKING });

    allStakingContracts.map(async staking => {
      return await this.stakingDepositServiceEth.checkStakingDepositBalance(staking);
    });

    // RELEASE CRON LOCK
    this.cronLock = false;
  }
}
