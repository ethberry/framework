import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { ITemplateSearchDto } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";

import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { AssetService } from "../../../exchange/asset/asset.service";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { Erc998TokenService } from "../token/token.service";
import { MysteryBoxService } from "../../../mechanics/marketing/mystery/box/box.service";

@Injectable()
export class Erc998TemplateService extends TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    protected readonly templateEntityRepository: Repository<TemplateEntity>,
    protected readonly assetService: AssetService,
    protected readonly tokenService: Erc998TokenService,
    protected readonly contractService: ContractService,
    protected readonly mysteryBoxService: MysteryBoxService,
  ) {
    super(templateEntityRepository, assetService, tokenService, contractService, mysteryBoxService);
  }

  public async search(
    dto: Partial<ITemplateSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<TemplateEntity>, number]> {
    return super.search(dto, userEntity, [ModuleType.HIERARCHY], [TokenType.ERC998]);
  }
}
