import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { ConfigService } from "@nestjs/config";
import { Contract, providers, Wallet } from "ethers";

import { ETHERS_RPC, ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import LotterySol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/Lottery.sol/Lottery.json";
import { blockAwait } from "../../../../common/utils";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ModuleType } from "@framework/types";
import { ILotteryOption } from "./interfaces";

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

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: "lotteryRound" })
  public async lotteryRound(): Promise<void> {
    const lotteryAddr = this.configService.get<string>("LOTTERY_ADDR", "");

    const contract = new Contract(lotteryAddr, LotterySol.abi, this.signer);
    await contract.endRound();

    // wait block
    await blockAwait(1, this.jsonRpcProvider);

    await contract.startRound();
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

    const { roundSchedule }: ILotteryOption = JSON.parse(lotteryEntity.description);

    this.schedulerRegistry.deleteCronJob("lotteryRound");
    const job = new CronJob(roundSchedule, async () => {
      await this.lotteryRound();
    });
    this.schedulerRegistry.addCronJob("lotteryRound", job);
    job.start();
  }
}
