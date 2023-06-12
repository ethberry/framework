import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { encodeBytes32String, hexlify, randomBytes, Wallet, WeiPerEther, ZeroAddress } from "ethers";

import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@gemunion/nest-js-module-exchange-signer";
import { testChainId } from "@framework/constants";

import { ISignLotteryDto } from "./interfaces";

@Injectable()
export class LotterySignService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
  ) {}

  public async sign(dto: ISignLotteryDto): Promise<IServerSignature> {
    const { account, referrer = ZeroAddress, ticketNumbers } = dto;

    const nonce = randomBytes(32);
    const expiresAt = 0;
    const signature = await this.getSignature(
      account,
      {
        nonce,
        externalId: 0,
        expiresAt,
        referrer,
        extra: encodeBytes32String("0x"),
      },
      ticketNumbers,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(account: string, params: IParams, ticketNumbers: Array<boolean>): Promise<string> {
    return this.signer.signTypedData(
      // Domain
      {
        name: "Lottery",
        version: "1.0.0",
        chainId: ~~this.configService.get<number>("CHAIN_ID", Number(testChainId)),
        verifyingContract: this.configService.get<string>("LOTTERY_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "account", type: "address" },
          { name: "params", type: "Params" },
          { name: "numbers", type: "bool[36]" },
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
        account,
        params,
        numbers: ticketNumbers,
        price: WeiPerEther,
      },
    );
  }
}
