import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { hexlify, randomBytes, ZeroAddress } from "ethers";
import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@gemunion/nest-js-module-exchange-signer";
import { SignerService } from "@gemunion/nest-js-module-exchange-signer";
import { TokenType } from "@framework/types";

import { ISignLotteryDto } from "./interfaces";
import { LotteryRoundService } from "../round/round.service";
import { LotteryRoundEntity } from "../round/round.entity";

@Injectable()
export class LotterySignService {
  constructor(
    private readonly signerService: SignerService,
    private readonly configService: ConfigService,
    private readonly roundService: LotteryRoundService,
  ) {}

  public async sign(dto: ISignLotteryDto): Promise<IServerSignature> {
    const { account, referrer = ZeroAddress, ticketNumbers, roundId } = dto;
    const lotteryRound = await this.roundService.findCurrentRoundWithRelations({ id: roundId });

    if (!lotteryRound) {
      throw new NotFoundException("roundNotFound");
    }

    const nonce = randomBytes(32);
    const expiresAt = 0;
    const signature = await this.getSignature(
      account,
      {
        nonce,
        externalId: 0, // TODO use it?
        expiresAt,
        referrer,
        extra: ticketNumbers,
      },
      lotteryRound,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(account: string, params: IParams, roundEntity: LotteryRoundEntity): Promise<string> {
    return this.signerService.getManyToManySignature(
      account,
      params,
      [
        {
          tokenType: 0,
          token: roundEntity.contract.address,
          tokenId: "0",
          amount: "0",
        },
        {
          tokenType: 2,
          token: roundEntity.ticketContract.address,
          tokenId: "0",
          amount: "1",
        },
      ],
      [
        {
          tokenType: Object.values(TokenType).indexOf(roundEntity.price.components[0].tokenType),
          token: roundEntity.price.components[0].contract.address,
          tokenId: roundEntity.price.components[0].template.tokens[0].tokenId,
          amount: roundEntity.price.components[0].amount,
        },
      ],
    );
  }
}
