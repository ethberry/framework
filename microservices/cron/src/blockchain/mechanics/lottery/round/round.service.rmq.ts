import { Inject, Injectable, Logger, LoggerService, NotFoundException, NotAcceptableException } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ClientProxy } from "@nestjs/microservices";
import { CronJob } from "cron";
import { IsNull, Not, JsonContains } from "typeorm";

import type { ILotteryScheduleUpdateRmq } from "@framework/types";
import { ContractStatus, CoreEthType, CronExpression, ModuleType, RmqProviderType } from "@framework/types";

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

  public async initSchedule(): Promise<void> {
    const lotteryEntities = await this.contractService.findAll({
      contractModule: ModuleType.LOTTERY,
      contractStatus: ContractStatus.ACTIVE,
      isPaused: false,
      contractType: IsNull(), // ?
      parameters: Not(JsonContains({ schedule: IsNull() })),
    });

    lotteryEntities.map(lottery => {
      return Object.values(CronExpression).includes(lottery.parameters.schedule as unknown as CronExpression)
        ? this.updateOrCreateRoundCronJob({
            address: lottery.address,
            schedule: lottery.parameters.schedule as CronExpression,
          })
        : void 0;
    });

    // this.updateOrCreateRoundCronJob(dto);
  }

  public async updateSchedule(dto: ILotteryScheduleUpdateRmq): Promise<void> {
    const lotteryEntity = await this.contractService.findOne({ address: dto.address });

    if (!lotteryEntity) {
      throw new NotFoundException("contractNotFound");
    }

    // TODO do we need to test it?
    if (!Object.values(CronExpression).includes(dto.schedule as unknown as CronExpression)) {
      throw new NotAcceptableException("notAcceptableSchedule");
    }

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
      this.loggerService.error(e, LotteryRoundServiceRmq.name);
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
