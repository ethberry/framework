import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Wallet } from "ethers";

import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";

import { IAirdropSign } from "./interfaces";

@Injectable()
export class AirdropSignService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
  ) {}

  public async airdropSign(dto: IAirdropSign): Promise<string> {
    const { account, airdropId, templateId } = dto;

    const signature = await this.signer._signTypedData(
      // Domain
      {
        name: "Airdrop",
        version: "1.0.0",
        chainId: ~~this.configService.get<string>("CHAIN_ID", "1337"),
        verifyingContract: this.configService.get<string>("AIRDROP_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "account", type: "address" },
          { name: "airdropId", type: "uint256" },
          { name: "templateId", type: "uint256" },
        ],
      },
      // Value
      {
        account,
        airdropId,
        templateId,
      },
    );

    return signature;
  }
}
