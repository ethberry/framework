import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Contract, JsonRpcProvider, Wallet } from "ethers";

import { ETHERS_RPC, ETHERS_SIGNER } from "@gemunion/nest-js-module-ethers-gcp";
import type { IRaffleScheduleUpdateRmq } from "@framework/types";

import RaffleSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Raffle/random/RaffleRandomGemunion.sol/RaffleRandomGemunion.json";

import { blockAwait, getCurrentRaffleRound } from "../../../../common/utils";

@Injectable()
export class RaffleRoundServiceRmq {
  constructor(
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
  ) {}

  public async startRound(dto: IRaffleScheduleUpdateRmq): Promise<void> {
    const contract = new Contract(dto.address, RaffleSol.abi, this.signer);
    const currentRound = await getCurrentRaffleRound(dto.address, RaffleSol.abi, this.jsonRpcProvider);
    this.loggerService.log(JSON.stringify(currentRound, null, "\t"), RaffleRoundServiceRmq.name);

    const { roundId, endTimestamp, acceptedAsset, ticketAsset, maxTicket } = currentRound;

    // if not dummy round
    if (BigInt(roundId) !== 0n) {
      // if current round still active - end round
      if (BigInt(endTimestamp) === 0n) {
        try {
          await contract.endRound();
        } catch (e) {
          this.loggerService.log(JSON.stringify(e, null, "\t"), RaffleRoundServiceRmq.name);
        }
      }
      // wait block
      await blockAwait(1, this.jsonRpcProvider);
      try {
        // start round with the same parameters
        await contract.startRound(acceptedAsset, ticketAsset, maxTicket);
      } catch (e) {
        this.loggerService.log(JSON.stringify(e, null, "\t"), RaffleRoundServiceRmq.name);
      }
    }
  }
}
