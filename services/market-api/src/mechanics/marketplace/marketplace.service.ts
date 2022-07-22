import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { BigNumber, utils } from "ethers";

import { IServerSignature } from "@gemunion/types-collection";
import { TokenType } from "@framework/types";

import { ISignTemplateDto } from "./interfaces";
import { SignerService } from "../signer/signer.service";
import { TemplateService } from "../../blockchain/hierarchy/template/template.service";
import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";

@Injectable()
export class MarketplaceService {
  constructor(private readonly templateService: TemplateService, private readonly signerService: SignerService) {}

  public async sign(dto: ISignTemplateDto): Promise<IServerSignature> {
    const { templateId, account } = dto;
    const templateEntity = await this.templateService.findOne(
      { id: templateId },
      {
        join: {
          alias: "template",
          leftJoinAndSelect: {
            contract: "template.contract",
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
    const signature = await this.getSignature(nonce, account, expiresAt, templateEntity);

    return { nonce: utils.hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    nonce: Uint8Array,
    account: string,
    expiresAt: number,
    templateEntity: TemplateEntity,
  ): Promise<string> {
    return this.signerService.getOneToManySignature(
      nonce,
      account,
      templateEntity.id,
      expiresAt,
      {
        tokenType: Object.keys(TokenType).indexOf(templateEntity.contract.contractType),
        token: templateEntity.contract.address,
        tokenId: templateEntity.id.toString(),
        amount: "1",
      },
      templateEntity.price.components.map(component => ({
        tokenType: Object.keys(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: component.template.tokens[0].tokenId,
        amount: component.amount,
      })),
    );
  }
}
