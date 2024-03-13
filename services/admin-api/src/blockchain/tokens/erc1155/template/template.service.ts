import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ns } from "@framework/constants";
import type { ITemplateSearchDto } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";

import { ContractService } from "../../../hierarchy/contract/contract.service";
import type { ITemplateCreateDto } from "../../../hierarchy/template/interfaces";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { AssetService } from "../../../exchange/asset/asset.service";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { Erc1155TokenService } from "../token/token.service";
import { MysteryBoxService } from "../../../mechanics/marketing/mystery/box/box.service";

@Injectable()
export class Erc1155TemplateService extends TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    protected readonly templateEntityRepository: Repository<TemplateEntity>,
    protected readonly assetService: AssetService,
    protected readonly tokenService: Erc1155TokenService,
    protected readonly contractService: ContractService,
    protected readonly mysteryBoxService: MysteryBoxService,
  ) {
    super(templateEntityRepository, assetService, tokenService, contractService, mysteryBoxService);
  }

  public async search(
    dto: Partial<ITemplateSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<TemplateEntity>, number]> {
    return super.search(dto, userEntity, [ModuleType.HIERARCHY], [TokenType.ERC1155]);
  }

  public async getMaxTokenIdForContract(contractId: number): Promise<number> {
    const queryString = `
        select coalesce(max(token_token_id::integer), 0) as "tokenId"
        from (SELECT "token"."token_id" AS "token_token_id"
              FROM ${ns}."token" "token"
                       LEFT JOIN ${ns}."template" "template" ON "template"."id" = "token"."template_id"
                       LEFT JOIN ${ns}."contract" "contract" ON "contract"."id" = "template"."contract_id"
              WHERE contract_id = $1) AS tokens
    `;

    const result: Array<{ tokenId: number }> = await this.templateEntityRepository.query(queryString, [contractId]);
    return result[0].tokenId;
  }

  public async createTemplate(dto: ITemplateCreateDto, userEntity: UserEntity): Promise<TemplateEntity> {
    const templateEntity = await super.createTemplate(dto, userEntity);
    const maxTokenId = await this.getMaxTokenIdForContract(templateEntity.contractId);

    await this.tokenService.create({
      tokenId: (maxTokenId + 1).toString(),
      metadata: "{}",
      royalty: 0,
      template: templateEntity,
    });

    return templateEntity;
  }
}
