import { Injectable } from "@nestjs/common";
import { utils } from "ethers";

import { IServerSignature } from "@gemunion/types-collection";
import { IParams, SignerService } from "@gemunion/nest-js-module-exchange-signer";

import { ISignLotteryDto } from "./interfaces";

@Injectable()
export class LotterySignService {
  constructor(private readonly signerService: SignerService) {}

  public async sign(dto: ISignLotteryDto): Promise<IServerSignature> {
    const { ticketNumbers, account, referrer } = dto;

    const nonce = utils.randomBytes(32);
    const expiresAt = 0;
    const signature = await this.getSignature(
      account,
      {
        nonce,
        externalId: 0,
        expiresAt,
        referrer,
      },
      ticketNumbers,
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(account: string, params: IParams, ticketNumbers: Array<boolean>): Promise<string> {
    void [account, params, ticketNumbers];
    return Promise.resolve("");
  }
}
