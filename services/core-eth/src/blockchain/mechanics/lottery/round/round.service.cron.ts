import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { ConfigService } from "@nestjs/config";
import { Contract, JsonRpcProvider, Wallet } from "ethers";

import { ETHERS_RPC, ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import LotterySol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/random/LotteryRandomGemunion.sol/LotteryRandomGemunion.json";

import { blockAwait, getCurrentRound } from "../../../../common/utils";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ILotteryOption, ModuleType } from "@framework/types";

@Injectable()
export class LotteryRoundServiceCron {
  constructor(
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
    private readonly contractService: ContractService,
  ) {}

  public async lotteryRound(address: string): Promise<void> {
    // const lotteryAddr = this.configService.get<string>("LOTTERY_ADDR", "");
    const contract = new Contract(address, LotterySol.abi, this.signer);
    const currentRound = await getCurrentRound(address, LotterySol.abi, this.jsonRpcProvider);
    const { endTimestamp, acceptedAsset, ticketAsset } = currentRound;

    try {
      // if round still active
      if (endTimestamp !== "0") {
        await contract.endRound();
      }
    } catch (e) {
      this.loggerService.log(JSON.stringify(e, null, "\t"), LotteryRoundServiceCron.name);
    } finally {
      // wait block
      await blockAwait(1, this.jsonRpcProvider);

      // start round with same parameters
      await contract.startRound(acceptedAsset, ticketAsset);
    }
  }

  public setRoundCronJob(dto: { cron: CronExpression; lottery: string }): void {
    const job = new CronJob(dto.cron, async () => {
      await this.lotteryRound(dto.lottery);
    });

    this.schedulerRegistry.addCronJob(`lotteryRound@${dto.lottery}`, job);
    job.start();
  }

  public updateOrCreateRoundCronJob(dto: { cron: CronExpression; address: string }): void {
    try {
      this.schedulerRegistry.deleteCronJob(`lotteryRound@${dto.address}`);
    } catch (e) {
      this.loggerService.log(JSON.stringify(e, null, "\t"), LotteryRoundServiceCron.name);
    } finally {
      const job = new CronJob(dto.cron, async () => {
        await this.lotteryRound(dto.address);
      });
      this.schedulerRegistry.addCronJob(`lotteryRound@${dto.address}`, job);
      job.start();
      this.loggerService.log(JSON.stringify(dto, null, "\t"), LotteryRoundServiceCron.name);
    }
  }

  public async updateRoundCronJobDb(): Promise<void> {
    const lotteryEntity = await this.contractService.findOne({
      contractModule: ModuleType.LOTTERY,
      contractType: undefined,
    });

    if (!lotteryEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const { schedule }: ILotteryOption = JSON.parse(lotteryEntity.description);

    this.schedulerRegistry.deleteCronJob(`lotteryRound@${lotteryEntity.address}`);
    const job = new CronJob(schedule, async () => {
      await this.lotteryRound(lotteryEntity.address);
    });
    this.schedulerRegistry.addCronJob(`lotteryRound@${lotteryEntity.address}`, job);
    job.start();
  }
}
