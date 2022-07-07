import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ns } from "@framework/constants";
import { AssetType, ITemplateSearchDto, TokenType } from "@framework/types";

import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";
import { TemplateService } from "../../blockchain/hierarchy/template/template.service";
import { ITemplateCreateDto } from "../../blockchain/hierarchy/template/interfaces";
import { Erc1155TokenService } from "../token/token.service";
import { AssetService } from "../../blockchain/asset/asset.service";

@Injectable()
export class Erc1155TemplateService extends TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    protected readonly templateEntityRepository: Repository<TemplateEntity>,
    protected readonly tokenService: Erc1155TokenService,
    private readonly assetService: AssetService,
    private readonly assetComponentService: AssetService,
  ) {
    super(templateEntityRepository);
  }

  public async search(dto: ITemplateSearchDto): Promise<[Array<TemplateEntity>, number]> {
    return super.search(dto, TokenType.ERC1155);
  }

  public async getMaxTokenIdForTemplate(templateId: number): Promise<number> {
    const queryString = `
      select
        coalesce(max(token_id::integer), 0) as "tokenId"
      from
        ${ns}.token
      where
       template_id = $1
    `;

    const result: Array<{ tokenId: number }> = await this.templateEntityRepository.query(queryString, [templateId]);

    return result[0].tokenId;
  }

  public async create(dto: ITemplateCreateDto): Promise<TemplateEntity> {
    const { price } = dto;

    // populate NATIVE or ERC20
    for (const component of price.components) {
      if (component.tokenType === TokenType.NATIVE || component.tokenType === TokenType.ERC20) {
        const template = await this.findOne({ contractId: component.contractId }, { relations: { tokens: true } });
        if (!template) {
          throw new NotFoundException("templateNotFound");
        }
        component.tokenId = template.tokens[0].id;
      }
    }

    const assetEntity = await this.assetService.create({
      assetType: AssetType.TEMPLATE,
      externalId: "0",
      components: [],
    });

    await this.assetComponentService.update(assetEntity, price);

    Object.assign(dto, { price: assetEntity });

    const templateEntity = await super.create(dto);

    const maxTokenId = await this.getMaxTokenIdForTemplate(templateEntity.id);

    await this.tokenService.create({
      tokenId: (maxTokenId + 1).toString(),
      attributes: "{}",
      royalty: 0,
      template: templateEntity,
    });

    return templateEntity;
  }
}
