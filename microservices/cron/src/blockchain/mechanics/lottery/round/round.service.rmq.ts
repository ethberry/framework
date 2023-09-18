import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ClientProxy } from "@nestjs/microservices";
import { CronJob } from "cron";

import type { ILotteryScheduleUpdateRmq } from "@framework/types";
import { CoreEthType, RmqProviderType } from "@framework/types";

import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class LotteryRoundServiceRmq {
  constructor(
    private readonly contractService: ContractService,
    private readonly schedulerRegistry: SchedulerRegistry,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(RmqProviderType.CORE_ETH_SERVICE)
    private readonly coreEthServiceProxy: ClientProxy,
  ) {}

  public async updateSchedule(dto: ILotteryScheduleUpdateRmq): Promise<void> {
    const lotteryEntity = await this.contractService.findOne({ address: dto.address });

    if (!lotteryEntity) {
      throw new NotFoundException("contractNotFound");
    }

    // TODO test it?
    // const currentParams = lotteryEntity.parameters;
    // Object.assign(currentParams, {
    //   schedule: dto.schedule,
    // });
    // Object.assign(lotteryEntity.parameters, currentParams);

    Object.assign(
      lotteryEntity.parameters,
      Object.assign(lotteryEntity.parameters, {
        schedule: dto.schedule,
      }),
    );

    await lotteryEntity.save();

    this.updateOrCreateRoundCronJob(dto);
  }

  public updateOrCreateRoundCronJob(dto: ILotteryScheduleUpdateRmq): void {
    try {
      this.schedulerRegistry.deleteCronJob(`lotteryRound@${dto.address}`);
    } catch (e) {
      this.loggerService.error(e, e.stack, LotteryRoundServiceRmq.name);
    } finally {
      const job = new CronJob(dto.schedule, () => {
        this.coreEthServiceProxy.emit(CoreEthType.START_LOTTERY_ROUND, dto);
      });
      this.schedulerRegistry.addCronJob(`lotteryRound@${dto.address}`, job);
      job.start();
      this.loggerService.log(JSON.stringify(dto, null, "\t"), LotteryRoundServiceRmq.name);
    }
  }
}
