import { Inject, Injectable, Logger, LoggerService, NotFoundException, NotAcceptableException } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ClientProxy } from "@nestjs/microservices";
import { IsNull, Not, JsonContains } from "typeorm";
import { CronJob } from "cron";

import type { IRaffleScheduleUpdateRmq } from "@framework/types";
import { ContractStatus, CoreEthType, CronExpression, ModuleType, RmqProviderType } from "@framework/types";

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
    @Inject(RmqProviderType.CORE_ETH_SERVICE_BINANCE)
    private readonly coreEthServiceBinanceProxy: ClientProxy,
  ) {}

  public async initSchedule(): Promise<void> {
    const raffleEntities = await this.contractService.findAll({
      contractModule: ModuleType.RAFFLE,
      contractStatus: ContractStatus.ACTIVE,
      isPaused: false,
      contractType: IsNull(), // ?
      parameters: Not(JsonContains({ schedule: IsNull() })),
    });

    raffleEntities.map(raffle => {
      return Object.values(CronExpression).includes(raffle.parameters.schedule as unknown as CronExpression)
        ? this.updateOrCreateRoundCronJob(
            {
              address: raffle.address,
              schedule: raffle.parameters.schedule as CronExpression,
            },
            raffle.chainId,
          )
        : void 0;
    });
  }

  public async updateSchedule(dto: IRaffleScheduleUpdateRmq): Promise<void> {
    const raffleEntity = await this.contractService.findOne({ address: dto.address });

    if (!raffleEntity) {
      throw new NotFoundException("contractNotFound");
    }

    // TODO do we need to test it?
    if (!Object.values(CronExpression).includes(dto.schedule as unknown as CronExpression)) {
      throw new NotAcceptableException("notAcceptableSchedule");
    }

    Object.assign(
      raffleEntity.parameters,
      Object.assign(raffleEntity.parameters, {
        schedule: dto.schedule,
      }),
    );

    await raffleEntity.save();

    this.updateOrCreateRoundCronJob(dto, raffleEntity.chainId);
  }

  public updateOrCreateRoundCronJob(dto: IRaffleScheduleUpdateRmq, chainId: number): void {
    try {
      this.schedulerRegistry.deleteCronJob(`raffleRound@${dto.address}`);
    } catch (e) {
      this.loggerService.error(e, RaffleRoundServiceRmq.name);
    } finally {
      const job = new CronJob(dto.schedule, () => {
        chainId === 56 || chainId === 97
          ? this.coreEthServiceBinanceProxy.emit(CoreEthType.START_RAFFLE_ROUND, dto)
          : this.coreEthServiceProxy.emit(CoreEthType.START_RAFFLE_ROUND, dto);
      });
      this.schedulerRegistry.addCronJob(`raffleRound@${dto.address}`, job);
      job.start();
      this.loggerService.log(JSON.stringify(dto, null, "\t"), RaffleRoundServiceRmq.name);
    }
  }
}
