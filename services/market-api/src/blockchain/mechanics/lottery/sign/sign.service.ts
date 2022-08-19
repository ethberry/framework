import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { constants, utils, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import { IServerSignature } from "@gemunion/types-collection";
import { IParams } from "@gemunion/nest-js-module-exchange-signer";

import { ISignLotteryDto } from "./interfaces";

@Injectable()
export class LotterySignService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
  ) {}

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
    return this.signer._signTypedData(
      // Domain
      {
        name: "Lottery",
        version: "1.0.0",
        chainId: ~~this.configService.get<string>("CHAIN_ID", "1337"),
        verifyingContract: this.configService.get<string>("LOTTERY_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "nonce", type: "bytes32" },
          { name: "numbers", type: "bool[40]" },
          { name: "price", type: "uint256" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "externalId", type: "uint256" },
          { name: "expiresAt", type: "uint256" },
          { name: "referrer", type: "address" },
        ],
      },
      // Value
      {
        params,
        numbers: ticketNumbers,
        price: constants.WeiPerEther,
      },
    );
  }
}
