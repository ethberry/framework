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
      `CORE_ETH_${networkName}`,
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
      contractType: IsNull(), // ?
      parameters: Not(JsonContains({ schedule: IsNull() })),
    });

    lotteryEntities.map(lottery => {
      return Object.values(CronExpression).includes(lottery.parameters.schedule as CronExpression)
        ? this.updateOrCreateRoundCronJob(
            {
              address: lottery.address,
              schedule: lottery.parameters.schedule as CronExpression,
            },
            lottery.chainId,
          )
        : void 0;
    });
  }

  public async updateSchedule(dto: ILotteryScheduleUpdateRmq): Promise<void> {
    const lotteryEntity = await this.contractService.findOne({ address: dto.address });

    if (!lotteryEntity) {
      throw new NotFoundException("contractNotFound");
    }

    Object.assign(
      lotteryEntity.parameters,
      Object.assign(lotteryEntity.parameters, {
        schedule: dto.schedule,
      }),
    );

    await lotteryEntity.save();

    this.updateOrCreateRoundCronJob(dto, lotteryEntity.chainId);
  }

  public updateOrCreateRoundCronJob(dto: ILotteryScheduleUpdateRmq, chainId: number): void {
    try {
      this.schedulerRegistry.deleteCronJob(`lotteryRound@${dto.address}`);
    } catch (e) {
      this.loggerService.error(e, LotteryRoundServiceRmq.name);
    } finally {
      const job = new CronJob(dto.schedule, () => {
        const clientProxy = this.getClientProxyForChain(chainId);
        clientProxy.emit(CoreEthType.START_LOTTERY_ROUND, dto);
      });
      this.schedulerRegistry.addCronJob(`lotteryRound@${dto.address}`, job);
      job.start();
      this.loggerService.log(JSON.stringify(dto, null, "\t"), LotteryRoundServiceRmq.name);
    }
  }
}
