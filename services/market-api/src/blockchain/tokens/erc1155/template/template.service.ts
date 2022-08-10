import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ITemplateSearchDto, TokenType } from "@framework/types";

import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { TemplateService } from "../../../hierarchy/template/template.service";

@Injectable()
export class Erc1155TemplateService extends TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    protected readonly templateEntityRepository: Repository<TemplateEntity>,
  ) {
    super(templateEntityRepository);
  }

  public async search(dto: ITemplateSearchDto): Promise<[Array<TemplateEntity>, number]> {
    return super.search(dto, TokenType.ERC1155);
  }
}
