import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { ITemplateSearchDto } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { AssetService } from "../../../exchange/asset/asset.service";
import { CollectionTokenService } from "../token/token.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class CollectionTemplateService extends TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    protected readonly templateEntityRepository: Repository<TemplateEntity>,
    protected readonly assetService: AssetService,
    protected readonly collectionTokenService: CollectionTokenService,
    protected readonly contractService: ContractService,
  ) {
    super(templateEntityRepository, assetService, collectionTokenService, contractService);
  }

  public search(dto: ITemplateSearchDto, userEntity: UserEntity): Promise<[Array<TemplateEntity>, number]> {
    return super.search(dto, userEntity, [ModuleType.COLLECTION], [TokenType.ERC721]);
  }
}
