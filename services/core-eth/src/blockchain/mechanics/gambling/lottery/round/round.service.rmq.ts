import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Contract, JsonRpcProvider, Wallet } from "ethers";

import { ETHERS_RPC, ETHERS_SIGNER } from "@ethberry/nest-js-module-ethers-gcp";
import type { ILotteryScheduleUpdateRmq } from "@framework/types";

import LotterySol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/Lottery.sol/Lottery.json";

import { blockAwait, getCurrentLotteryRound } from "../../../../../common/utils";

@Injectable()
export class LotteryRoundServiceRmq {
  constructor(
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
  ) {}

  public async startRound(dto: ILotteryScheduleUpdateRmq): Promise<void> {
    const { address } = dto;
    const contract = new Contract(address, LotterySol.abi, this.signer);
    const currentRound = await getCurrentLotteryRound(address, LotterySol.abi, this.jsonRpcProvider);
    this.loggerService.log(JSON.stringify(currentRound, null, "\t"), LotteryRoundServiceRmq.name);

    const { roundId, endTimestamp, acceptedAsset, ticketAsset, maxTicket } = currentRound;

    // if not dummy round
    if (BigInt(roundId) !== 0n) {
      // if current round still active - end round
      if (BigInt(endTimestamp) === 0n) {
        try {
          await contract.endRound();
        } catch (e) {
          this.loggerService.log(JSON.stringify(e, null, "\t"), LotteryRoundServiceRmq.name);
        }
      }
      // wait block
      await blockAwait(1, this.jsonRpcProvider);
      try {
        // start round with the same parameters
        await contract.startRound(acceptedAsset, ticketAsset, maxTicket);
      } catch (e) {
        this.loggerService.log(JSON.stringify(e, null, "\t"), LotteryRoundServiceRmq.name);
      }
    }
  }
}
