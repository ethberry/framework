import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { ConfigService } from "@nestjs/config";
import { Contract, JsonRpcProvider, Wallet } from "ethers";

import { ETHERS_RPC, ETHERS_SIGNER } from "@gemunion/nest-js-module-ethers-gcp";
import { IRaffleScheduleUpdateRmq } from "@framework/types";
import RaffleSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Raffle/random/RaffleRandomGemunion.sol/RaffleRandomGemunion.json";

import { blockAwait, getCurrentRound } from "../../../../common/utils";

@Injectable()
export class RaffleRoundServiceCron {
  constructor(
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  public async raffleRound(address: string): Promise<void> {
    const contract = new Contract(address, RaffleSol.abi, this.signer);
    const currentRound = await getCurrentRound(address, RaffleSol.abi, this.jsonRpcProvider);
    const { roundId, endTimestamp, acceptedAsset, ticketAsset, maxTicket } = currentRound;

    // if not dummy round
    if (BigInt(roundId) !== 0n) {
      // if current round still active - end round
      if (BigInt(endTimestamp) === 0n) {
        try {
          await contract.endRound();
        } catch (e) {
          this.loggerService.log(JSON.stringify(e, null, "\t"), RaffleRoundServiceCron.name);
        }
      }
      // wait block
      await blockAwait(1, this.jsonRpcProvider);
      try {
        // start round with the same parameters
        await contract.startRound(acceptedAsset, ticketAsset, maxTicket);
      } catch (e) {
        this.loggerService.log(JSON.stringify(e, null, "\t"), RaffleRoundServiceCron.name);
      }
    }
  }

  public updateOrCreateRoundCronJob(dto: IRaffleScheduleUpdateRmq): void {
    try {
      this.schedulerRegistry.deleteCronJob(`raffleRound@${dto.address}`);
    } catch (e) {
      this.loggerService.log(JSON.stringify(e, null, "\t"), RaffleRoundServiceCron.name);
    } finally {
      const job = new CronJob(dto.schedule, async () => {
        await this.raffleRound(dto.address);
      });
      this.schedulerRegistry.addCronJob(`raffleRound@${dto.address}`, job);
      job.start();
      this.loggerService.log(JSON.stringify(dto, null, "\t"), RaffleRoundServiceCron.name);
    }
  }
}
