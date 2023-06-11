import { Injectable, NotFoundException } from "@nestjs/common";
import { hexlify, zeroPadValue, toBeHex, randomBytes } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@gemunion/nest-js-module-exchange-signer";
import { SignerService } from "@gemunion/nest-js-module-exchange-signer";
import { SettingsKeys, TokenType } from "@framework/types";

import { SettingsService } from "../../../infrastructure/settings/settings.service";
import { TokenService } from "../../hierarchy/token/token.service";
import { TokenEntity } from "../../hierarchy/token/token.entity";
import { ISignRentTokenDto } from "./interfaces";
import { sorter } from "../../../common/utils/sorter";
import { RentService } from "./rent.service";
import { RentEntity } from "./rent.entity";

@Injectable()
export class RentSignService {
  constructor(
    private readonly signerService: SignerService,
    private readonly tokenService: TokenService,
    private readonly rentService: RentService,
    private readonly settingsService: SettingsService,
  ) {}

  public async sign(dto: ISignRentTokenDto): Promise<IServerSignature> {
    const { tokenId, account, referrer, expires, externalId } = dto;
    const tokenEntity = await this.tokenService.findOneWithRelations({ id: tokenId });

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const rentEntity = await this.rentService.findOneWithRelations({ id: externalId });

    if (!rentEntity) {
      throw new NotFoundException("rentNotFound");
    }

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);
    const nonce = randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;
    const lendExpires = zeroPadValue(toBeHex(expires), 32);

    const signature = await this.getSignature(
      account, // from
      {
        nonce,
        externalId, // rent.id
        expiresAt, // sign expires
        referrer, // to
        extra: lendExpires,
      },
      tokenEntity,
      rentEntity,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public getSignature(
    account: string,
    params: IParams,
    tokenEntity: TokenEntity,
    rentEntity: RentEntity,
  ): Promise<string> {
    return this.signerService.getOneToManySignature(
      account,
      params,
      {
        tokenType: Object.values(TokenType).indexOf(tokenEntity.template.contract.contractType),
        token: tokenEntity.template.contract.address,
        tokenId: tokenEntity.tokenId,
        amount: "1", // todo get from DTO? (for 1155)
      },
      rentEntity.price.components.sort(sorter("id")).map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId:
          component.template.tokens[0].tokenId === "0"
            ? component.template.tokens[0].templateId.toString()
            : component.template.tokens[0].tokenId,
        amount: component.amount,
      })),
    );
  }
}
