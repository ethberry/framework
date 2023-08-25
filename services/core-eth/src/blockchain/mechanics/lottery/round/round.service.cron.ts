import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { Contract, JsonRpcProvider, Wallet } from "ethers";

import { ETHERS_RPC, ETHERS_SIGNER } from "@gemunion/nest-js-module-ethers-gcp";
import { ILotteryScheduleUpdateRmq } from "@framework/types";
import LotterySol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/random/LotteryRandomGemunion.sol/LotteryRandomGemunion.json";

import { blockAwait, getCurrentLotteryRound } from "../../../../common/utils";

@Injectable()
export class LotteryRoundServiceCron {
  constructor(
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  public async lotteryRound(address: string): Promise<void> {
    const contract = new Contract(address, LotterySol.abi, this.signer);
    const currentRound = await getCurrentLotteryRound(address, LotterySol.abi, this.jsonRpcProvider);
    this.loggerService.log(JSON.stringify(currentRound, null, "\t"), LotteryRoundServiceCron.name);

    const { roundId, endTimestamp, acceptedAsset, ticketAsset, maxTicket } = currentRound;

    // if not dummy round
    if (BigInt(roundId) !== 0n) {
      // if current round still active - end round
      if (BigInt(endTimestamp) === 0n) {
        try {
          await contract.endRound();
        } catch (e) {
          this.loggerService.log(JSON.stringify(e, null, "\t"), LotteryRoundServiceCron.name);
        }
      }
      // wait block
      await blockAwait(1, this.jsonRpcProvider);
      try {
        // start round with the same parameters
        await contract.startRound(acceptedAsset, ticketAsset, maxTicket);
      } catch (e) {
        this.loggerService.log(JSON.stringify(e, null, "\t"), LotteryRoundServiceCron.name);
      }
    }
  }

  public updateOrCreateRoundCronJob(dto: ILotteryScheduleUpdateRmq): void {
    try {
      this.schedulerRegistry.deleteCronJob(`lotteryRound@${dto.address}`);
    } catch (e) {
      this.loggerService.log(JSON.stringify(e, null, "\t"), LotteryRoundServiceCron.name);
    } finally {
      const job = new CronJob(dto.schedule, async () => {
        await this.lotteryRound(dto.address);
      });
      this.schedulerRegistry.addCronJob(`lotteryRound@${dto.address}`, job);
      job.start();
      this.loggerService.log(JSON.stringify(dto, null, "\t"), LotteryRoundServiceCron.name);
    }
  }
}
