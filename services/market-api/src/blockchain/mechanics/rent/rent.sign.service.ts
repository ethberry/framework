import { Injectable, NotFoundException } from "@nestjs/common";
import { utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@gemunion/nest-js-module-exchange-signer";
import { SignerService } from "@gemunion/nest-js-module-exchange-signer";
import { SettingsKeys, TokenType } from "@framework/types";

import { SettingsService } from "../../../infrastructure/settings/settings.service";
import { TokenService } from "../../hierarchy/token/token.service";
import { TokenEntity } from "../../hierarchy/token/token.entity";
import { ISignRentTokenDto } from "./interfaces";

@Injectable()
export class RentSignService {
  constructor(
    private readonly signerService: SignerService,
    private readonly tokenService: TokenService,
    private readonly settingsService: SettingsService,
  ) {}

  public async sign(dto: ISignRentTokenDto): Promise<IServerSignature> {
    const { tokenId, account, referrer, expires, externalId } = dto;

    const tokenEntity = await this.tokenService.findOneWithRelations({ id: tokenId });

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);

    const nonce = utils.randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;
    const lendExpires = utils.hexZeroPad(utils.hexlify(expires), 32);

    const signature = await this.getSignature(
      account, // from
      lendExpires,
      {
        nonce,
        externalId, // type
        expiresAt, // sign expires
        referrer, // to
      },
      tokenEntity,
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt };
  }

  public getSignature(account: string, expires: string, params: IParams, tokenEntity: TokenEntity): Promise<string> {
    return this.signerService.getManyToManyExtraSignature(
      account,
      params,
      [
        {
          tokenType: Object.values(TokenType).indexOf(tokenEntity.template.contract.contractType),
          token: tokenEntity.template.contract.address,
          tokenId: tokenEntity.tokenId,
          amount: "1", // todo get from DTO? (for 1155)
        },
      ],
      tokenEntity.template.contract.rent[0].price.components.map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId:
          component.template.tokens[0].tokenId === "0"
            ? component.template.tokens[0].templateId.toString()
            : component.template.tokens[0].tokenId,
        amount: component.amount,
      })),
      expires,
    );
  }
}
