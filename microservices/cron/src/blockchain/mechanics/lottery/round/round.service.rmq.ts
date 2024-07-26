import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { CronJob } from "cron";
import { IsNull, JsonContains, Not } from "typeorm";

import type { ILotteryScheduleUpdateRmq } from "@framework/types";
import { ContractStatus, CoreEthType, ModuleType, GemunionSupportedChains } from "@framework/types";

import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class LotteryRoundServiceRmq {
  constructor(
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
  ) {}

  private getClientProxyForChain(chainId: number) {
    const networkName = Object.keys(GemunionSupportedChains)[Object.values(GemunionSupportedChains).indexOf(chainId)];
    if (!networkName) {
      throw new NotFoundException("networkNotFound");
    }

    const rmqUrl = this.configService.get<string>("RMQ_URL", "amqp://127.0.0.1:5672");
    const rmqQueueEthName = this.configService.get<string>(
      `RMQ_QUEUE_CORE_ETH_${networkName}`,
      `CORE_ETH_${networkName}`.toLowerCase(),
    );

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue: rmqQueueEthName,
        queueOptions: {
          durabl: false,
        },
      },
    });
  }

  public async initSchedule(): Promise<void> {
    const lotteryEntities = await this.contractService.findAll({
      contractModule: ModuleType.LOTTERY,
      contractStatus: ContractStatus.ACTIVE,
      isPaused: false,
      contractType: IsNull(), // Not lottery ticket
      parameters: Not(JsonContains({ schedule: IsNull() })),
    });

    lotteryEntities.forEach(lotteryEntity => {
      this.updateOrCreateRoundCronJob({
        address: lotteryEntity.address,
        chainId: lotteryEntity.chainId,
        schedule: lotteryEntity.parameters.schedule as CronExpression,
      });
    });
  }

  public async updateSchedule(dto: ILotteryScheduleUpdateRmq): Promise<void> {
    const { address, chainId, schedule } = dto;
    const lotteryEntity = await this.contractService.findOne({ address, chainId });

    if (!lotteryEntity) {
      throw new NotFoundException("contractNotFound");
    }

    Object.assign(
      lotteryEntity.parameters,
      Object.assign(lotteryEntity.parameters, {
        schedule,
      }),
    );

    await lotteryEntity.save();

    this.updateOrCreateRoundCronJob(dto);
  }

  public updateOrCreateRoundCronJob(dto: ILotteryScheduleUpdateRmq): void {
    const { address, chainId, schedule } = dto;
    try {
      this.schedulerRegistry.deleteCronJob(`lotteryRound_${address}@${chainId}`);
    } catch (e) {
      // NO_SCHEDULER_FOUND
      this.loggerService.error(e, LotteryRoundServiceRmq.name);
    } finally {
      const job = new CronJob(schedule as CronExpression, () => {
        const clientProxy = this.getClientProxyForChain(chainId);
        clientProxy.emit(CoreEthType.START_LOTTERY_ROUND, dto);
      });
      this.schedulerRegistry.addCronJob(`lotteryRound_${address}@${chainId}`, job);
      job.start();
      this.loggerService.log(`Updated cron schedule for lottery ${address}@${chainId}`, LotteryRoundServiceRmq.name);
    }
  }
}
