import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { ITemplateAutocompleteDto, ITemplateSearchDto } from "@framework/types";
import { ModuleType, TemplateStatus, TokenType } from "@framework/types";

import type { ITemplateCreateDto, ITemplateUpdateDto } from "./interfaces";
import { TemplateEntity } from "./template.entity";
import { AssetService } from "../../exchange/asset/asset.service";
import { UserEntity } from "../../../infrastructure/user/user.entity";
import { TokenService } from "../token/token.service";

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(TemplateEntity)
    protected readonly templateEntityRepository: Repository<TemplateEntity>,
    @Inject(forwardRef(() => AssetService))
    protected readonly assetService: AssetService,
    protected readonly tokenService: TokenService,
  ) {}

  public async search(
    dto: ITemplateSearchDto,
    userEntity: UserEntity,
    contractModule: Array<ModuleType>,
    contractType: Array<TokenType> | null,
  ): Promise<[Array<TemplateEntity>, number]> {
    const { query, templateStatus, contractIds, merchantId, skip, take } = dto;

    const queryBuilder = this.templateEntityRepository.createQueryBuilder("template");

    queryBuilder.select();

    queryBuilder.leftJoin("template.contract", "contract");
    queryBuilder.addSelect([
      "contract.address",
      "contract.decimals",
      "contract.contractType",
      "contract.contractModule",
      "contract.contractFeatures",
    ]);

    // get single token for ERC1155, to use in mint dialog
    queryBuilder.leftJoin("template.tokens", "tokens", "contract.contractType = :tokenType", {
      tokenType: TokenType.ERC1155,
    });
    queryBuilder.addSelect(["tokens.id", "tokens.tokenId"]);

    queryBuilder.andWhere("contract.merchantId = :merchantId", {
      merchantId,
    });
    queryBuilder.andWhere("contract.contractType = :contractType", {
      contractType,
    });
    queryBuilder.andWhere("contract.contractModule = :contractModule", {
      contractModule,
    });
    queryBuilder.andWhere("contract.chainId = :chainId", {
      chainId: userEntity.chainId,
    });

    if (templateStatus) {
      if (templateStatus.length === 1) {
        queryBuilder.andWhere("template.templateStatus = :templateStatus", { templateStatus: templateStatus[0] });
      } else {
        queryBuilder.andWhere("template.templateStatus IN(:...templateStatus)", { templateStatus });
      }
    }

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("template.contractId = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("template.contractId IN(:...contractIds)", { contractIds });
      }
    }

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(template.description->'blocks')`;
          return qb;
        },
        `blocks`,
        `TRUE`,
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("template.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "template.createdAt": "DESC",
      "template.id": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: ITemplateAutocompleteDto, userEntity: UserEntity): Promise<Array<TemplateEntity>> {
    const { contractFeatures, templateStatus, contractIds, contractModule, contractType } = dto;
    const queryBuilder = this.templateEntityRepository.createQueryBuilder("template");

    queryBuilder.select(["template.title", "template.id"]);

    queryBuilder.leftJoin("template.contract", "contract");
    queryBuilder.addSelect(["contract.address", "contract.decimals", "contract.contractType"]);

    // get single token for ERC1155, to use in mint dialog
    queryBuilder.leftJoin("template.tokens", "tokens", "contract.contractType = :tokenType", {
      tokenType: TokenType.ERC1155,
    });
    queryBuilder.addSelect(["tokens.id", "tokens.tokenId"]);

    queryBuilder.andWhere("contract.chainId = :chainId", {
      chainId: userEntity.chainId,
    });

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("template.contractId = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("template.contractId IN(:...contractIds)", { contractIds });
      }
    }

    if (contractModule) {
      if (contractModule.length === 1) {
        queryBuilder.andWhere("contract.contractModule = :contractModule", { contractModule: contractModule[0] });
      } else {
        queryBuilder.andWhere("contract.contractModule IN(:...contractModule)", { contractModule });
      }
    }

    if (contractType) {
      if (contractType.length === 1) {
        queryBuilder.andWhere("manager.contractType = :contractType", {
          contractType: contractType[0],
        });
      } else {
        queryBuilder.andWhere("manager.contractType IN(:...contractType)", { contractType });
      }
    }

    if (contractFeatures) {
      if (contractFeatures.length === 1) {
        queryBuilder.andWhere(":contractFeature = ANY(contract.contractFeatures)", {
          contractFeature: contractFeatures[0],
        });
      } else {
        queryBuilder.andWhere("contract.contractFeatures && :contractFeatures", { contractFeatures });
      }
    }

    if (templateStatus) {
      if (templateStatus.length === 1) {
        queryBuilder.andWhere("template.templateStatus = :templateStatus", { templateStatus: templateStatus[0] });
      } else {
        queryBuilder.andWhere("template.templateStatus IN(:...templateStatus)", { templateStatus });
      }
    }

    queryBuilder.orderBy({
      "template.createdAt": "DESC",
    });

    return queryBuilder.getMany();
  }

  public findOne(
    where: FindOptionsWhere<TemplateEntity>,
    options?: FindOneOptions<TemplateEntity>,
  ): Promise<TemplateEntity | null> {
    return this.templateEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<TemplateEntity>): Promise<TemplateEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "template",
        leftJoinAndSelect: {
          price: "template.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
        },
      },
    });
  }

  public async createTemplate(dto: ITemplateCreateDto): Promise<TemplateEntity> {
    const assetEntity = await this.assetService.create();

    const templateEntity = await this.templateEntityRepository
      .create({
        ...dto,
        price: assetEntity,
      })
      .save();

    return this.update({ id: templateEntity.id }, dto);
  }

  public async create(dto: DeepPartial<TemplateEntity>): Promise<TemplateEntity> {
    return this.templateEntityRepository.create(dto).save();
  }

  public async update(
    where: FindOptionsWhere<TemplateEntity>,
    dto: Partial<ITemplateUpdateDto>,
  ): Promise<TemplateEntity> {
    const { price, ...rest } = dto;
    const templateEntity = await this.findOne(where, {
      join: {
        alias: "template",
        leftJoinAndSelect: {
          price: "template.price",
          components: "price.components",
        },
      },
    });

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    Object.assign(templateEntity, rest);

    if (price) {
      await this.assetService.update(templateEntity.price, price);
    }

    return templateEntity.save();
  }

  public async delete(where: FindOptionsWhere<TemplateEntity>): Promise<void> {
    const count = await this.tokenService.count({ templateId: where.id });
    if (!count) {
      await this.templateEntityRepository.delete(where);
    } else {
      await this.update(where, { templateStatus: TemplateStatus.INACTIVE });
    }
  }
}
