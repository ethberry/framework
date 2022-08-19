import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ITemplateSearchDto, ModuleType, TokenType } from "@framework/types";

import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { AssetService } from "../../../mechanics/asset/asset.service";

@Injectable()
export class Erc998TemplateService extends TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    protected readonly templateEntityRepository: Repository<TemplateEntity>,
    protected readonly assetService: AssetService,
  ) {
    super(templateEntityRepository, assetService);
  }

  public async search(dto: ITemplateSearchDto): Promise<[Array<TemplateEntity>, number]> {
    return super.search(dto, TokenType.ERC998, ModuleType.CORE);
  }
}
