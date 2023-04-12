import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ITemplateSearchDto, ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { CollectionTokenService } from "../token/token.service";
import { AssetService } from "../../../exchange/asset/asset.service";

@Injectable()
export class CollectionTemplateService extends TemplateService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(TemplateEntity)
    protected readonly templateEntityRepository: Repository<TemplateEntity>,
    protected readonly assetService: AssetService,
    protected readonly collectionTokenService: CollectionTokenService,
  ) {
    super(templateEntityRepository, assetService, collectionTokenService);
  }

  public search(dto: ITemplateSearchDto, userEntity: UserEntity): Promise<[Array<TemplateEntity>, number]> {
    return super.search(dto, userEntity, TokenType.ERC721, ModuleType.COLLECTION);
  }
}
