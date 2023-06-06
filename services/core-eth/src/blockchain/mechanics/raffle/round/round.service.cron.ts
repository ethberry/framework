import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { ConfigService } from "@nestjs/config";
import { Contract, providers, Wallet } from "ethers";

import { ETHERS_RPC, ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import RaffleSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Raffle/random/RaffleRandomGemunion.sol/RaffleRandomGemunion.json";

import { blockAwait, getCurrentRound } from "../../../../common/utils";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { IRaffleOption, ModuleType } from "@framework/types";

@Injectable()
export class RaffleRoundServiceCron {
  constructor(
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: providers.JsonRpcProvider,
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
    private readonly contractService: ContractService,
  ) {}

  public async raffleRound(address: string): Promise<void> {
    // const raffleAddr = this.configService.get<string>("RAFFLE_ADDR", "");
    const contract = new Contract(address, RaffleSol.abi, this.signer);
    const currentRound = await getCurrentRound(address, RaffleSol.abi, this.jsonRpcProvider);
    const { endTimestamp, acceptedAsset, ticketAsset } = currentRound;

    try {
      // if round still active
      if (endTimestamp !== "0") {
        await contract.endRound();
      }
    } catch (e) {
      this.loggerService.log(JSON.stringify(e, null, "\t"), RaffleRoundServiceCron.name);
    } finally {
      // wait block
      await blockAwait(1, this.jsonRpcProvider);

      // start round with same parameters
      await contract.startRound(acceptedAsset, ticketAsset);
    }
  }

  public setRoundCronJob(dto: { cron: CronExpression; raffle: string }): void {
    const job = new CronJob(dto.cron, async () => {
      await this.raffleRound(dto.raffle);
    });

    this.schedulerRegistry.addCronJob(`raffleRound@${dto.raffle}`, job);
    job.start();
  }

  public updateOrCreateRoundCronJob(dto: { cron: CronExpression; address: string }): void {
    try {
      this.schedulerRegistry.deleteCronJob(`raffleRound@${dto.address}`);
    } catch (e) {
      this.loggerService.log(JSON.stringify(e, null, "\t"), RaffleRoundServiceCron.name);
    } finally {
      const job = new CronJob(dto.cron, async () => {
        await this.raffleRound(dto.address);
      });
      this.schedulerRegistry.addCronJob(`raffleRound@${dto.address}`, job);
      job.start();
      this.loggerService.log(JSON.stringify(dto, null, "\t"), RaffleRoundServiceCron.name);
    }
  }

  public async updateRoundCronJobDb(): Promise<void> {
    const raffleEntity = await this.contractService.findOne({
      contractModule: ModuleType.RAFFLE,
      contractType: undefined,
    });

    if (!raffleEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const { schedule }: IRaffleOption = JSON.parse(raffleEntity.description);

    this.schedulerRegistry.deleteCronJob(`raffleRound@${raffleEntity.address}`);
    const job = new CronJob(schedule, async () => {
      await this.raffleRound(raffleEntity.address);
    });
    this.schedulerRegistry.addCronJob(`raffleRound@${raffleEntity.address}`, job);
    job.start();
  }
}
