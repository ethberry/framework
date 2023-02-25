import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { BigNumber, constants, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@gemunion/nest-js-module-exchange-signer";
import { SignerService } from "@gemunion/nest-js-module-exchange-signer";
import { TokenType } from "@framework/types";

import { ISignTemplateDto } from "./interfaces";
import { TemplateService } from "../../hierarchy/template/template.service";
import { TemplateEntity } from "../../hierarchy/template/template.entity";

@Injectable()
export class MarketplaceService {
  constructor(private readonly templateService: TemplateService, private readonly signerService: SignerService) {}

  public async sign(dto: ISignTemplateDto): Promise<IServerSignature> {
    const { account, referrer = constants.AddressZero, templateId } = dto;
    const templateEntity = await this.templateService.findOne(
      { id: templateId },
      {
        join: {
          alias: "template",
          leftJoinAndSelect: {
            contract: "template.contract",
            tokens: "template.tokens",
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

    const cap = BigNumber.from(templateEntity.cap);
    if (cap.gt(0) && cap.lte(templateEntity.amount)) {
      throw new BadRequestException("limitExceeded");
    }

    const nonce = utils.randomBytes(32);
    const expiresAt = 0;
    const signature = await this.getSignature(
      account,
      {
        nonce,
        externalId: templateEntity.id,
        expiresAt,
        referrer,
      },
      templateEntity,
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(account: string, params: IParams, templateEntity: TemplateEntity): Promise<string> {
    return this.signerService.getOneToManySignature(
      account,
      params,
      {
        tokenType: Object.keys(TokenType).indexOf(templateEntity.contract.contractType),
        token: templateEntity.contract.address,
        tokenId:
          templateEntity.contract.contractType === TokenType.ERC1155
            ? templateEntity.tokens[0].tokenId
            : templateEntity.id.toString(),
        amount: "1",
      },
      templateEntity.price.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
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
