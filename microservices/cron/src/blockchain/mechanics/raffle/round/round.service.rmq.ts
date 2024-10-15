import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { IsNull, JsonContains, Not } from "typeorm";
import { CronJob } from "cron";

import type { IRaffleScheduleUpdateRmq } from "@framework/types";
import { ContractStatus, CoreEthType, ModuleType, EthberrySupportedChains } from "@framework/types";

import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class RaffleRoundServiceRmq {
  constructor(
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
  ) {}

  private getClientProxyForChain(chainId: number) {
    const networkName = Object.keys(EthberrySupportedChains)[Object.values(EthberrySupportedChains).indexOf(chainId)];
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
    const raffleEntities = await this.contractService.findAll({
      contractModule: ModuleType.RAFFLE,
      contractStatus: ContractStatus.ACTIVE,
      isPaused: false,
      contractType: IsNull(), // ?
      parameters: Not(JsonContains({ schedule: IsNull() })),
    });

    raffleEntities.forEach(raffleEntity => {
      this.updateOrCreateRoundCronJob({
        address: raffleEntity.address,
        chainId: raffleEntity.chainId,
        schedule: raffleEntity.parameters.schedule as CronExpression,
      });
    });
  }

  public async updateSchedule(dto: IRaffleScheduleUpdateRmq): Promise<void> {
    const { address, chainId, schedule } = dto;
    const raffleEntity = await this.contractService.findOne({ address, chainId });

    if (!raffleEntity) {
      throw new NotFoundException("contractNotFound");
    }

    Object.assign(
      raffleEntity.parameters,
      Object.assign(raffleEntity.parameters, {
        schedule,
      }),
    );

    await raffleEntity.save();

    this.updateOrCreateRoundCronJob(dto);
  }

  public updateOrCreateRoundCronJob(dto: IRaffleScheduleUpdateRmq): void {
    const { address, chainId, schedule } = dto;
    try {
      this.schedulerRegistry.deleteCronJob(`raffleRound_${address}@${chainId}`);
    } catch (e) {
      // NO_SCHEDULER_FOUND
      this.loggerService.error(e, RaffleRoundServiceRmq.name);
    } finally {
      const job = new CronJob(schedule as CronExpression, () => {
        const clientProxy = this.getClientProxyForChain(chainId);
        clientProxy.emit(CoreEthType.START_RAFFLE_ROUND, dto);
      });
      this.schedulerRegistry.addCronJob(`raffleRound_${address}@${chainId}`, job);
      job.start();
      this.loggerService.log(`Updated cron schedule for lottery ${address}@${chainId}`, RaffleRoundServiceRmq.name);
    }
  }
}
