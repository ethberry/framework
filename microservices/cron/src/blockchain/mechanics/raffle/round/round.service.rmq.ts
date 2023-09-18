import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ClientProxy } from "@nestjs/microservices";
import { CronJob } from "cron";

import type { IRaffleScheduleUpdateRmq } from "@framework/types";
import { CoreEthType, RmqProviderType } from "@framework/types";

import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class RaffleRoundServiceRmq {
  constructor(
    private readonly contractService: ContractService,
    private readonly schedulerRegistry: SchedulerRegistry,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(RmqProviderType.CORE_ETH_SERVICE)
    private readonly coreEthServiceProxy: ClientProxy,
  ) {}

  public async updateSchedule(dto: IRaffleScheduleUpdateRmq): Promise<void> {
    const raffleEntity = await this.contractService.findOne({ address: dto.address });

    if (!raffleEntity) {
      throw new NotFoundException("contractNotFound");
    }

    // TODO simplify?
    const currentParams = raffleEntity.parameters;
    Object.assign(currentParams, {
      schedule: dto.schedule,
    });
    Object.assign(raffleEntity.parameters, currentParams);

    await raffleEntity.save();

    this.updateOrCreateRoundCronJob(dto);
  }

  public updateOrCreateRoundCronJob(dto: IRaffleScheduleUpdateRmq): void {
    try {
      this.schedulerRegistry.deleteCronJob(`raffleRound@${dto.address}`);
    } catch (e) {
      this.loggerService.error(e, e.stack, RaffleRoundServiceRmq.name);
    } finally {
      const job = new CronJob(dto.schedule, () => {
        this.coreEthServiceProxy.emit(CoreEthType.START_RAFFLE_ROUND, dto);
      });
      this.schedulerRegistry.addCronJob(`raffleRound@${dto.address}`, job);
      job.start();
      this.loggerService.log(JSON.stringify(dto, null, "\t"), RaffleRoundServiceRmq.name);
    }
  }
}
