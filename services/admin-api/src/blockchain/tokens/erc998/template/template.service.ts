import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ModuleType, TokenType } from "@framework/types";
import type { ITemplateSearchDto } from "@framework/types";

import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { AssetService } from "../../../exchange/asset/asset.service";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { Erc998TokenService } from "../token/token.service";

@Injectable()
export class Erc998TemplateService extends TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    protected readonly templateEntityRepository: Repository<TemplateEntity>,
    protected readonly assetService: AssetService,
    protected readonly tokenService: Erc998TokenService,
  ) {
    super(templateEntityRepository, assetService, tokenService);
  }

  public async search(dto: ITemplateSearchDto, userEntity: UserEntity): Promise<[Array<TemplateEntity>, number]> {
    return super.search(dto, userEntity, TokenType.ERC998, ModuleType.HIERARCHY);
  }
}
