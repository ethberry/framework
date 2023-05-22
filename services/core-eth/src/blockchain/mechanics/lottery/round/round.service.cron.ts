import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { ConfigService } from "@nestjs/config";
import { Contract, providers, Wallet } from "ethers";

import { ETHERS_RPC, ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import LotterySol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/random/LotteryRandomGemunion.sol/LotteryRandomGemunion.json";

import { blockAwait } from "../../../../common/utils";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ILotteryOption, ModuleType } from "@framework/types";

@Injectable()
export class LotteryRoundServiceCron {
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

  public async lotteryRound(): Promise<void> {
    const lotteryAddr = this.configService.get<string>("LOTTERY_ADDR", "");

    const contract = new Contract(lotteryAddr, LotterySol.abi, this.signer);
    try {
      await contract.endRound();
    } catch (e) {
      this.loggerService.log(JSON.stringify(e, null, "\t"), LotteryRoundServiceCron.name);
    } finally {
      // wait block
      await blockAwait(1, this.jsonRpcProvider);

      await contract.startRound();
    }
  }

  public setRoundCronJob(dto: CronExpression): void {
    const job = new CronJob(dto, async () => {
      await this.lotteryRound();
    });

    this.schedulerRegistry.addCronJob("lotteryRound", job);
    job.start();
  }

  public updateRoundCronJob(dto: CronExpression): void {
    this.schedulerRegistry.deleteCronJob("lotteryRound");
    const job = new CronJob(dto, async () => {
      await this.lotteryRound();
    });
    this.schedulerRegistry.addCronJob("lotteryRound", job);
    job.start();
    this.loggerService.log(JSON.stringify(dto, null, "\t"), LotteryRoundServiceCron.name);
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

    this.schedulerRegistry.deleteCronJob("lotteryRound");
    const job = new CronJob(schedule, async () => {
      await this.lotteryRound();
    });
    this.schedulerRegistry.addCronJob("lotteryRound", job);
    job.start();
  }
}
