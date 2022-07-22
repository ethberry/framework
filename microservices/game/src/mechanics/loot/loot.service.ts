import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { utils, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import { IServerSignature } from "@gemunion/types-collection";
import { TokenType } from "@framework/types";

import { UserEntity } from "../../user/user.entity";
import { TemplateService } from "../../blockchain/hierarchy/template/template.service";
import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";
import { SignerService } from "../signer/signer.service";

@Injectable()
export class LootService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
    private readonly templateService: TemplateService,
    private readonly signerService: SignerService,
  ) {}

  public async signPostBattleLoot(userEntity: UserEntity): Promise<IServerSignature> {
    const templateEntities = await this.templateService.findAll({});

    const nonce = utils.randomBytes(32);
    const expiresAt = 0;
    const signature = await this.getSignature(nonce, userEntity.wallet, expiresAt, templateEntities);
    return { nonce: utils.hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    nonce: Uint8Array,
    account: string,
    expiresAt: number,
    templateEntities: Array<TemplateEntity>,
  ): Promise<string> {
    return this.signerService.getManyToManySignature(
      nonce,
      account,
      123, // TODO pass claimId
      expiresAt,
      templateEntities.map(templateEntity => ({
        tokenType: Object.keys(TokenType).indexOf(templateEntity.contract.contractType),
        token: templateEntity.contract.address,
        tokenId: templateEntity.id.toString(),
        amount: templateEntity.amount,
      })),
      [],
    );
  }
}
