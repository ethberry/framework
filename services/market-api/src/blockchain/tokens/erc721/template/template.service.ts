import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { ITemplateSearchDto } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";

import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@Injectable()
export class Erc721TemplateService extends TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    protected readonly templateEntityRepository: Repository<TemplateEntity>,
  ) {
    super(templateEntityRepository);
  }

  public async search(
    dto: Partial<ITemplateSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<TemplateEntity>, number]> {
    return super.search(dto, userEntity, [ModuleType.HIERARCHY], [TokenType.ERC721]);
  }
}
