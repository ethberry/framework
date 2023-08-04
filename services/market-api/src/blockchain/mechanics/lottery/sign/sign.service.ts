import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { hexlify, randomBytes, ZeroAddress } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@framework/nest-js-module-exchange-signer";
import { SignerService } from "@framework/nest-js-module-exchange-signer";
import { TokenType } from "@framework/types";
// import { boolArrayToByte32 } from "@framework/traits-api";

import { LotteryRoundService } from "../round/round.service";
import { LotteryRoundEntity } from "../round/round.entity";
import { ISignLotteryDto } from "./interfaces";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";

@Injectable()
export class LotterySignService {
  constructor(
    private readonly signerService: SignerService,
    private readonly contractService: ContractService,
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
      await this.contractService.findSystemContractByName("Exchange"),
      account,
      {
        externalId: lotteryRound.id,
        expiresAt,
        nonce,
        extra: ticketNumbers, // encoded from ui
        receiver: lotteryRound.contract.address,
        referrer,
      },
      lotteryRound,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    verifyingContract: ContractEntity,
    account: string,
    params: IParams,
    roundEntity: LotteryRoundEntity,
  ): Promise<string> {
    return this.signerService.getOneToOneSignature(
      verifyingContract,
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
