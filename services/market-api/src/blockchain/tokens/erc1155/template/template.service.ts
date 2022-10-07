import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import type { ITemplateSearchDto } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";

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

  public async search(dto: ITemplateSearchDto, chainId: number): Promise<[Array<TemplateEntity>, number]> {
    return super.search(dto, chainId, TokenType.ERC1155, ModuleType.HIERARCHY);
  }

  public findOneWithRelations(where: FindOptionsWhere<TemplateEntity>): Promise<TemplateEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "template",
        leftJoinAndSelect: {
          contract: "template.contract",
          tokens: "template.tokens",
          price: "template.price",
          price_components: "price.components",
          price_template: "price_components.template",
          price_contract: "price_components.contract",
          price_tokens: "price_template.tokens",
        },
      },
    });
  }
}
