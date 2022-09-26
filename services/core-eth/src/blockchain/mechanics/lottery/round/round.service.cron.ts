import { Inject, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import { Contract, Wallet, providers } from "ethers";

import { ETHERS_SIGNER, ETHERS_RPC } from "@gemunion/nestjs-ethers";
import LotterySol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/Lottery.sol/Lottery.json";
import { blockAwait } from "../../../../common/utils";

@Injectable()
export class LotteryRoundServiceCron {
  constructor(
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: providers.JsonRpcProvider,
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async listen(): Promise<void> {
    const lotteryAddr = this.configService.get<string>("LOTTERY_ADDR", "");

    const contract = new Contract(lotteryAddr, LotterySol.abi, this.signer);
    await contract.endRound();

    // wait block
    await blockAwait(1, this.jsonRpcProvider);

    await contract.startRound();
  }
}
