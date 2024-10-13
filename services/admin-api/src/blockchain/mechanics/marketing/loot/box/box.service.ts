import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import type { ILootBoxAutocompleteDto, ILootBoxSearchDto } from "@framework/types";
import { LootBoxStatus, TemplateStatus, TokenType } from "@framework/types";

import { createNestedValidationError } from "../../../../../common/utils/nestedValidationError";
import { TemplateService } from "../../../../hierarchy/template/template.service";
import { AssetService } from "../../../../exchange/asset/asset.service";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { TokenService } from "../../../../hierarchy/token/token.service";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import { AssetEntity } from "../../../../exchange/asset/asset.entity";
import { ClaimTemplateService } from "../../claim/template/template.service";
import { TemplateDeleteService } from "../../../../hierarchy/template/template.delete.service";
import type { ILootBoxCreateDto, ILootBoxUpdateDto } from "./interfaces";
import { LootBoxEntity } from "./box.entity";

@Injectable()
export class LootBoxService {
  constructor(
    @InjectRepository(LootBoxEntity)
    private readonly lootBoxEntityRepository: Repository<LootBoxEntity>,
    private readonly tokenService: TokenService,
    @Inject(forwardRef(() => TemplateService))
    private readonly templateService: TemplateService,
    @Inject(forwardRef(() => TemplateDeleteService))
    private readonly templateDeleteService: TemplateDeleteService,
    private readonly contractService: ContractService,
    private readonly assetService: AssetService,
    private readonly claimTemplateService: ClaimTemplateService,
  ) {}

  public async search(
    dto: Partial<ILootBoxSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<LootBoxEntity>, number]> {
    const { query, lootBoxStatus, contractIds, templateIds, minPrice, maxPrice, skip, take } = dto;

    const queryBuilder = this.lootBoxEntityRepository.createQueryBuilder("box");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("box.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");

    queryBuilder.leftJoinAndSelect("box.content", "content");
    queryBuilder.leftJoinAndSelect("content.components", "content_components");
    queryBuilder.leftJoinAndSelect("content_components.contract", "content_contract");
    queryBuilder.leftJoinAndSelect("content_components.template", "content_template");

    queryBuilder.leftJoinAndSelect("template.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_template.tokens", "price_tokens");

    // item or price template must be active
    queryBuilder.andWhere("content_template.templateStatus = :templateStatus", {
      templateStatus: TemplateStatus.ACTIVE,
    });
    queryBuilder.andWhere("price_template.templateStatus = :templateStatus", { templateStatus: TemplateStatus.ACTIVE });

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(box.description->'blocks')`;
          return qb;
        },
        "blocks",
        "TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("box.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (lootBoxStatus) {
      if (lootBoxStatus.length === 1) {
        queryBuilder.andWhere("box.lootBoxStatus = :lootBoxStatus", {
          lootBoxStatus: lootBoxStatus[0],
        });
      } else {
        queryBuilder.andWhere("box.lootBoxStatus IN(:...lootBoxStatus)", { lootBoxStatus });
      }
    }

    if (templateIds) {
      if (templateIds.length === 1) {
        queryBuilder.andWhere("box.templateId = :templateId", {
          templateId: templateIds[0],
        });
      } else {
        queryBuilder.andWhere("box.templateId IN(:...templateIds)", { templateIds });
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

    queryBuilder.andWhere("contract.merchantId = :merchantId", {
      merchantId: userEntity.merchantId,
    });

    queryBuilder.andWhere("contract.chainId = :chainId", {
      chainId: userEntity.chainId,
    });

    if (minPrice || maxPrice) {
      queryBuilder.leftJoin("price.components", "price_filter");

      if (maxPrice) {
        queryBuilder.andWhere("price_filter.amount <= :maxPrice", { maxPrice });
      }

      if (minPrice) {
        queryBuilder.andWhere("price_filter.amount >= :minPrice", { minPrice });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "box.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: ILootBoxAutocompleteDto, userEntity: UserEntity): Promise<Array<LootBoxEntity>> {
    const { contractIds } = dto;
    const queryBuilder = this.lootBoxEntityRepository.createQueryBuilder("box");

    queryBuilder.leftJoinAndSelect("box.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");

    queryBuilder.leftJoinAndSelect("box.content", "content");
    queryBuilder.leftJoinAndSelect("content.components", "components");
    queryBuilder.leftJoinAndSelect("components.contract", "content_contract");
    queryBuilder.leftJoinAndSelect("components.template", "content_template");

    queryBuilder.leftJoinAndSelect(
      "content_template.tokens",
      "token",
      "content_contract.contractType = :contractType",
      {
        contractType: TokenType.ERC1155,
      },
    );

    // queryBuilder.leftJoinAndSelect("box.price", "price");
    // queryBuilder.leftJoinAndSelect("price.components", "price_components");
    // queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    // queryBuilder.leftJoinAndSelect("price_components.template", "price_template");

    // content or price template must be active
    queryBuilder.andWhere("content_template.templateStatus = :templateStatus", {
      templateStatus: TemplateStatus.ACTIVE,
    });
    // queryBuilder.andWhere("price_template.templateStatus = :templateStatus", { templateStatus: TemplateStatus.ACTIVE });

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("template.contractId = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("template.contractId IN(:...contractIds)", { contractIds });
      }
    }

    queryBuilder.andWhere("contract.chainId = :chainId", {
      chainId: userEntity.chainId,
    });

    queryBuilder.orderBy({
      "box.title": "ASC",
    });

    return queryBuilder.getMany();
  }

  public findOne(
    where: FindOptionsWhere<LootBoxEntity>,
    options?: FindOneOptions<LootBoxEntity>,
  ): Promise<LootBoxEntity | null> {
    return this.lootBoxEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<LootBoxEntity>,
    options?: FindManyOptions<LootBoxEntity>,
  ): Promise<Array<LootBoxEntity>> {
    return this.lootBoxEntityRepository.find({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<LootBoxEntity>): Promise<LootBoxEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "box",
        leftJoinAndSelect: {
          template: "box.template",
          content: "box.content",
          content_components: "content.components",
          content_contract: "content_components.contract",
          content_template: "content_components.template",
          price: "template.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          price_template: "price_components.template",
        },
      },
      order: {
        createdAt: "DESC",
      },
    });
  }

  public async update(
    where: FindOptionsWhere<LootBoxEntity>,
    dto: Partial<ILootBoxUpdateDto>,
    userEntity: UserEntity,
  ): Promise<LootBoxEntity> {
    const { price, content, ...rest } = dto;

    const lootBoxEntity = await this.findOne(where, {
      join: {
        alias: "box",
        leftJoinAndSelect: {
          template: "box.template",
          contract: "template.contract",
          content: "box.content",
          content_components: "content.components",
          price: "template.price",
          price_components: "price.components",
        },
      },
    });

    if (!lootBoxEntity) {
      throw new NotFoundException("lootBoxNotFound");
    }

    if (lootBoxEntity.template.contract.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const { max, min } = rest;

    if (max && content && max > content.components.length) {
      throw new BadRequestException(
        createNestedValidationError(dto, "max", [{ property: "max", constraints: { message: "rangeUnderflow" } }]),
      );
    }

    if (min && content && content.components.length > min) {
      throw new BadRequestException(
        createNestedValidationError(dto, "min", [{ property: "min", constraints: { message: "rangeOverflow" } }]),
      );
    }

    if (min && max && min > max) {
      throw new BadRequestException(
        createNestedValidationError(dto, "min", [{ property: "min", constraints: { message: "rangeOverflow" } }]),
      );
    }

    if (price) {
      await this.assetService.update(lootBoxEntity.template.price, price, userEntity);
    }

    if (content) {
      await this.assetService.update(lootBoxEntity.content, content, userEntity);
    }

    const { title, description, imageUrl } = rest;
    await this.templateService.update({ id: lootBoxEntity.templateId }, { title, description, imageUrl }, userEntity);

    Object.assign(lootBoxEntity, rest);

    return lootBoxEntity.save();
  }

  public async create(dto: ILootBoxCreateDto, userEntity: UserEntity): Promise<LootBoxEntity> {
    const { price, content, contractId, min, max } = dto;

    const contractEntity = await this.contractService.findOne({ id: contractId });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    if (contractEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    if (max > content.components.length) {
      throw new BadRequestException(
        createNestedValidationError(dto, "max", [{ property: "max", constraints: { message: "rangeUnderflow" } }]),
      );
    }

    if (content.components.length > min) {
      throw new BadRequestException(
        createNestedValidationError(dto, "min", [{ property: "min", constraints: { message: "rangeOverflow" } }]),
      );
    }

    if (min > max) {
      throw new BadRequestException(
        createNestedValidationError(dto, "min", [{ property: "min", constraints: { message: "rangeOverflow" } }]),
      );
    }

    const priceEntity = await this.assetService.create();
    await this.assetService.update(priceEntity, price, userEntity);

    const contentEntity = await this.assetService.create();
    await this.assetService.update(contentEntity, content, userEntity);

    const templateEntity = await this.templateService.create({
      title: dto.title,
      description: dto.description,
      price: priceEntity,
      amount: 0n,
      imageUrl: dto.imageUrl,
      contractId: contractEntity.id,
    });

    return this.lootBoxEntityRepository
      .create({
        ...dto,
        content: contentEntity,
        template: templateEntity,
      })
      .save();
  }

  public async delete(where: FindOptionsWhere<LootBoxEntity>, userEntity: UserEntity): Promise<LootBoxEntity> {
    const lootBoxEntity = await this.findOne({ id: where.id }, { relations: { template: { contract: true } } });

    if (!lootBoxEntity) {
      throw new NotFoundException("lootBoxNotFound");
    }

    if (lootBoxEntity.template.contract.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const count = await this.tokenService.count({ templateId: lootBoxEntity.templateId });

    if (count) {
      await this.templateService.update(
        { id: lootBoxEntity.templateId },
        { templateStatus: TemplateStatus.INACTIVE },
        userEntity,
      );
      Object.assign(lootBoxEntity, { lootBoxStatus: LootBoxStatus.INACTIVE });
      return lootBoxEntity.save();
    } else {
      await this.templateService.delete({ id: lootBoxEntity.templateId }, userEntity);
      return lootBoxEntity.remove();
    }
  }

  public async deactivateBoxes(assets: Array<AssetEntity>): Promise<DeleteResult> {
    const lootBoxEntities = await this.lootBoxEntityRepository.find({
      where: [
        {
          content: In(assets.map(asset => asset.id)),
        },
        {
          template: {
            price: In(assets.map(asset => asset.id)),
          },
        },
      ],
    });

    for (const lootBoxEntity of lootBoxEntities) {
      await this.templateDeleteService.deactivateTemplate(lootBoxEntity.template);
    }

    await this.claimTemplateService.deactivateClaims(lootBoxEntities.map(lootBoxEntity => lootBoxEntity.content));

    return this.lootBoxEntityRepository.delete({
      id: In(lootBoxEntities.map(lootBoxEntity => lootBoxEntity.id)),
    });
  }
}
