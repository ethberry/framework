import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ns } from "@framework/constants";
import { ITemplateSearchDto, TokenType } from "@framework/types";

import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";
import { TemplateService } from "../../blockchain/hierarchy/template/template.service";
import { ITemplateCreateDto } from "../../blockchain/hierarchy/template/interfaces";
import { Erc1155TokenService } from "../token/token.service";
import { AssetService } from "../../mechanics/asset/asset.service";

@Injectable()
export class Erc1155TemplateService extends TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    protected readonly templateEntityRepository: Repository<TemplateEntity>,
    protected readonly assetService: AssetService,
    protected readonly tokenService: Erc1155TokenService,
  ) {
    super(templateEntityRepository, assetService);
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
