import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { encodeBytes32String, hexlify, randomBytes, ZeroAddress } from "ethers";

import type { IParams } from "@framework/nest-js-module-exchange-signer";
import { SignerService } from "@framework/nest-js-module-exchange-signer";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { TokenType } from "@framework/types";

import { ISignRaffleDto } from "./interfaces";
import { RaffleRoundService } from "../round/round.service";
import { RaffleRoundEntity } from "../round/round.entity";

@Injectable()
export class RaffleSignService {
  constructor(
    private readonly signerService: SignerService,
    private readonly configService: ConfigService,
    private readonly roundService: RaffleRoundService,
  ) {}

  public async sign(dto: ISignRaffleDto): Promise<IServerSignature> {
    const { account, referrer = ZeroAddress, roundId } = dto;

    const raffleRound = await this.roundService.findCurrentRoundWithRelations({ id: roundId });

    if (!raffleRound) {
      throw new NotFoundException("roundNotFound");
    }

    const nonce = randomBytes(32);
    const expiresAt = 0;
    const signature = await this.getSignature(
      account,
      {
        externalId: raffleRound.id,
        expiresAt,
        nonce,
        extra: encodeBytes32String("0x"),
        receiver: raffleRound.contract.address,
        referrer,
      },
      raffleRound,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(account: string, params: IParams, roundEntity: RaffleRoundEntity): Promise<string> {
    return this.signerService.getOneToOneSignature(
      account,
      params,
      {
        tokenType: 2,
        token: roundEntity.ticketContract.address,
        tokenId: "0",
        amount: "1",
      },
      {
        tokenType: Object.values(TokenType).indexOf(roundEntity.price.components[0].tokenType),
        token: roundEntity.price.components[0].contract.address,
        tokenId: roundEntity.price.components[0].template.tokens[0].tokenId,
        amount: roundEntity.price.components[0].amount,
      },
    );
  }
}
