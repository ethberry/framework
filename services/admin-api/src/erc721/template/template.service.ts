import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AssetType, ITemplateSearchDto, TokenType } from "@framework/types";

import { AssetService } from "../../blockchain/asset/asset.service";
import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";
import { TemplateService } from "../../blockchain/hierarchy/template/template.service";
import { ITemplateCreateDto } from "../../blockchain/hierarchy/template/interfaces";

@Injectable()
export class Erc721TemplateService extends TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    protected readonly templateEntityRepository: Repository<TemplateEntity>,
    private readonly assetService: AssetService,
    private readonly assetComponentService: AssetService,
  ) {
    super(templateEntityRepository);
  }

  public async search(dto: ITemplateSearchDto): Promise<[Array<TemplateEntity>, number]> {
    return super.search(dto, TokenType.ERC721);
  }

  public async createTemplate(dto: ITemplateCreateDto): Promise<TemplateEntity> {
    const { price } = dto;

    const assetEntity = await this.assetService.create({
      assetType: AssetType.TEMPLATE,
      externalId: "0",
      components: [],
    });

    await this.assetComponentService.update(assetEntity, price);

    Object.assign(dto, { price: assetEntity });
    return super.create(dto);
  }
}
