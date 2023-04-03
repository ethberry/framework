import { Injectable } from "@nestjs/common";
import { utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import { SignerService } from "@gemunion/nest-js-module-exchange-signer";

@Injectable()
export class MysterySignService {
  constructor(private readonly signerService: SignerService) {}

  public async sign(_dto: any): Promise<IServerSignature> {
    const nonce = utils.randomBytes(32);
    const expiresAt = 0;

    await Promise.resolve();

    return { nonce: utils.hexlify(nonce), signature: "0x", expiresAt };
  }
}
