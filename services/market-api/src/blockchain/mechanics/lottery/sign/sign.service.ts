import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { constants, utils, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@gemunion/nest-js-module-exchange-signer";
import { SignerService } from "@gemunion/nest-js-module-exchange-signer";

import { ISignLotteryDto } from "./interfaces";

@Injectable()
export class LotterySignService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
    private readonly signerService: SignerService,
  ) {}

  public async sign(dto: ISignLotteryDto): Promise<IServerSignature> {
    const { account, ticketNumbers, referrer = constants.AddressZero } = dto;

    const nonce = utils.randomBytes(32);
    const expiresAt = 0;
    const signature = await this.getSignature(account, {
      nonce,
      externalId: 0,
      expiresAt,
      referrer,
      extra: ticketNumbers,
    });

    return { nonce: utils.hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(account: string, params: IParams): Promise<string> {
    // TODO fix getOneToManySignature
    return this.signerService.getManyToManySignature(account, params, [], []);
  }
}
