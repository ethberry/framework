import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ITemplateSearchDto, TokenType } from "@framework/types";

import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { UserEntity } from "../../../../user/user.entity";

@Injectable()
export class Erc998TemplateService extends TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    protected readonly templateEntityRepository: Repository<TemplateEntity>,
  ) {
    super(templateEntityRepository);
  }

  public async search(dto: ITemplateSearchDto, userEntity: UserEntity): Promise<[Array<TemplateEntity>, number]> {
    return super.search(dto, userEntity, TokenType.ERC998);
  }
}
