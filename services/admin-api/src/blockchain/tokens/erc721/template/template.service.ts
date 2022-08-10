import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ITemplateSearchDto, TokenType } from "@framework/types";

import { AssetService } from "../../../mechanics/asset/asset.service";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { TemplateService } from "../../../hierarchy/template/template.service";

@Injectable()
export class Erc721TemplateService extends TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    protected readonly templateEntityRepository: Repository<TemplateEntity>,
    protected readonly assetService: AssetService,
  ) {
    super(templateEntityRepository, assetService);
  }

  public async search(dto: ITemplateSearchDto): Promise<[Array<TemplateEntity>, number]> {
    return super.search(dto, TokenType.ERC721);
  }
}
