import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { encodeBytes32String, hexlify, randomBytes, ZeroAddress } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@gemunion/nest-js-module-exchange-signer";
import { SignerService } from "@gemunion/nest-js-module-exchange-signer";
import { SettingsKeys, TokenType } from "@framework/types";

import { SettingsService } from "../../../infrastructure/settings/settings.service";
import { TemplateService } from "../../hierarchy/template/template.service";
import { TemplateEntity } from "../../hierarchy/template/template.entity";
import type { ISignTemplateDto } from "./interfaces";

@Injectable()
export class MarketplaceService {
  constructor(
    private readonly templateService: TemplateService,
    private readonly signerService: SignerService,
    private readonly settingsService: SettingsService,
  ) {}

  public async sign(dto: ISignTemplateDto): Promise<IServerSignature> {
    const { account, referrer = ZeroAddress, templateId } = dto;
    const templateEntity = await this.templateService.findOne(
      { id: templateId },
      {
        join: {
          alias: "template",
          leftJoinAndSelect: {
            contract: "template.contract",
            // tokens: "template.tokens",
            price: "template.price",
            price_components: "price.components",
            price_template: "price_components.template",
            price_contract: "price_components.contract",
            price_tokens: "price_template.tokens",
          },
        },
      },
    );

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    const cap = BigInt(templateEntity.cap);
    if (cap > 0 && cap <= BigInt(templateEntity.amount)) {
      throw new BadRequestException("limitExceeded");
    }

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);

    const nonce = randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;
    const signature = await this.getSignature(
      account,
      {
        nonce,
        externalId: templateEntity.id,
        expiresAt,
        referrer,
        extra: encodeBytes32String("0x"),
      },
      templateEntity,
    );

    return { nonce: hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(account: string, params: IParams, templateEntity: TemplateEntity): Promise<string> {
    return this.signerService.getOneToManySignature(
      account,
      params,
      {
        tokenType: Object.values(TokenType).indexOf(templateEntity.contract.contractType!),
        token: templateEntity.contract.address,
        tokenId:
          templateEntity.contract.contractType === TokenType.ERC1155
            ? templateEntity.tokens[0].tokenId
            : templateEntity.id.toString(),
        amount: "1",
      },
      templateEntity.price.components.map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        // pass templateId instead of tokenId = 0
        tokenId:
          component.template.tokens[0].tokenId === "0"
            ? component.template.tokens[0].templateId.toString()
            : component.template.tokens[0].tokenId,
        amount: component.amount,
      })),
    );
  }
}
