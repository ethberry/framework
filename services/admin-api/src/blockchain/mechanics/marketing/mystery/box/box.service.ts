import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Brackets,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Repository,
  UpdateResult,
} from "typeorm";

import type { IMysteryBoxAutocompleteDto, IMysteryBoxSearchDto } from "@framework/types";
import { ContractFeatures, MysteryBoxStatus, TemplateStatus } from "@framework/types";

import { TemplateService } from "../../../../hierarchy/template/template.service";
import { AssetService } from "../../../../exchange/asset/asset.service";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { TokenService } from "../../../../hierarchy/token/token.service";
import { ContractService } from "../../../../hierarchy/contract/contract.service";
import type { IMysteryBoxCreateDto, IMysteryBoxUpdateDto } from "./interfaces";
import { MysteryBoxEntity } from "./box.entity";
import { AssetEntity } from "../../../../exchange/asset/asset.entity";
import { ClaimTemplateService } from "../../claim/template/template.service";
import { TemplateDeleteService } from "../../../../hierarchy/template/template.delete.service";

@Injectable()
export class MysteryBoxService {
  constructor(
    @InjectRepository(MysteryBoxEntity)
    private readonly mysteryBoxEntityRepository: Repository<MysteryBoxEntity>,
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
    dto: Partial<IMysteryBoxSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<MysteryBoxEntity>, number]> {
    const { query, mysteryBoxStatus, contractIds, templateIds, minPrice, maxPrice, skip, take } = dto;

    const queryBuilder = this.mysteryBoxEntityRepository.createQueryBuilder("box");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("box.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");

    queryBuilder.leftJoinAndSelect("box.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");

    queryBuilder.leftJoinAndSelect("template.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_template.tokens", "price_tokens");

    // item or price template must be active
    queryBuilder.andWhere("item_template.templateStatus = :templateStatus", { templateStatus: TemplateStatus.ACTIVE });
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

    if (mysteryBoxStatus) {
      if (mysteryBoxStatus.length === 1) {
        queryBuilder.andWhere("box.mysteryBoxStatus = :mysteryBoxStatus", {
          mysteryBoxStatus: mysteryBoxStatus[0],
        });
      } else {
        queryBuilder.andWhere("box.mysteryBoxStatus IN(:...mysteryBoxStatus)", { mysteryBoxStatus });
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

  public async autocomplete(dto: IMysteryBoxAutocompleteDto, userEntity: UserEntity): Promise<Array<MysteryBoxEntity>> {
    const { contractIds } = dto;
    const queryBuilder = this.mysteryBoxEntityRepository.createQueryBuilder("box");

    queryBuilder.leftJoinAndSelect("box.template", "template");
    queryBuilder.leftJoinAndSelect("template.contract", "contract");
    // item
    queryBuilder.leftJoinAndSelect("box.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "components");
    queryBuilder.leftJoinAndSelect("components.contract", "item_contract");
    queryBuilder.leftJoinAndSelect("components.template", "item_template");
    // price
    // queryBuilder.leftJoinAndSelect("box.price", "price");
    // queryBuilder.leftJoinAndSelect("price.components", "price_components");
    // queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    // queryBuilder.leftJoinAndSelect("price_components.template", "price_template");

    // item or price template must be active
    queryBuilder.andWhere("item_template.templateStatus = :templateStatus", { templateStatus: TemplateStatus.ACTIVE });
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
    where: FindOptionsWhere<MysteryBoxEntity>,
    options?: FindOneOptions<MysteryBoxEntity>,
  ): Promise<MysteryBoxEntity | null> {
    return this.mysteryBoxEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<MysteryBoxEntity>,
    options?: FindManyOptions<MysteryBoxEntity>,
  ): Promise<Array<MysteryBoxEntity>> {
    return this.mysteryBoxEntityRepository.find({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<MysteryBoxEntity>): Promise<MysteryBoxEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "box",
        leftJoinAndSelect: {
          template: "box.template",
          item: "box.item",
          item_components: "item.components",
          item_contract: "item_components.contract",
          item_template: "item_components.template",
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

  public async updateAll(
    where: FindOptionsWhere<MysteryBoxEntity>,
    dto: Partial<IMysteryBoxUpdateDto>,
    userEntity: UserEntity,
  ): Promise<MysteryBoxEntity> {
    const { price, item, ...rest } = dto;

    const mysteryBoxEntity = await this.findOne(where, {
      join: {
        alias: "box",
        leftJoinAndSelect: {
          template: "box.template",
          contract: "template.contract",
          item: "box.item",
          item_components: "item.components",
          price: "template.price",
          price_components: "price.components",
        },
      },
    });

    if (!mysteryBoxEntity) {
      throw new NotFoundException("mysteryBoxNotFound");
    }

    if (mysteryBoxEntity.template.contract.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    if (price) {
      await this.assetService.update(mysteryBoxEntity.template.price, price, userEntity);
    }

    if (item) {
      await this.assetService.update(mysteryBoxEntity.item, item, userEntity);
    }

    // SYNC UPDATE TEMPLATE
    const { title, description, imageUrl } = rest;
    await this.templateService.update(
      { id: mysteryBoxEntity.templateId },
      { title, description, imageUrl },
      userEntity,
    );

    Object.assign(mysteryBoxEntity, rest);

    return mysteryBoxEntity.save();
  }

  public async create(dto: IMysteryBoxCreateDto, userEntity: UserEntity): Promise<MysteryBoxEntity> {
    const { price, item, contractId } = dto;

    const contractEntity = await this.contractService.findOne({ id: contractId });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    if (contractEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }
    
    // Check contract of each item for Random feature,
    for (const [index, component] of item.components.entries()) {
      const tokenContract = await this.contractService.findOneOrFail({id: component.contractId})
      if (!tokenContract.contractFeatures.includes(ContractFeatures.RANDOM) || true) {
        throw new BadRequestException([
          {
            target: dto,
            value: dto.item,
            property: `item.components[${index}].contractId`,
            children: [],
            constraints: { isCustom: "randomFeature" },
          },
        ]);
      }
    }

    const priceEntity = await this.assetService.create();
    await this.assetService.update(priceEntity, price, userEntity);

    const itemEntity = await this.assetService.create();
    await this.assetService.update(itemEntity, item, userEntity);

    Object.assign(dto, { price: priceEntity, item: itemEntity });

    const templateEntity = await this.templateService.create({
      title: dto.title,
      description: dto.description,
      price: priceEntity,
      amount: "0",
      imageUrl: dto.imageUrl,
      contractId: contractEntity.id,
    });

    return this.mysteryBoxEntityRepository.create({ ...dto, template: templateEntity }).save();
  }

  public async update(
    where: FindOptionsWhere<MysteryBoxEntity>,
    dto: Partial<IMysteryBoxUpdateDto>,
  ): Promise<UpdateResult> {
    return this.mysteryBoxEntityRepository.update(where, dto);
  }

  public async delete(where: FindOptionsWhere<MysteryBoxEntity>, userEntity: UserEntity): Promise<MysteryBoxEntity> {
    const mysteryBoxEntity = await this.findOne({ id: where.id }, { relations: { template: { contract: true } } });

    if (!mysteryBoxEntity) {
      throw new NotFoundException("mysteryBoxNotFound");
    }

    if (mysteryBoxEntity.template.contract.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const count = await this.tokenService.count({ templateId: mysteryBoxEntity.templateId });

    if (count) {
      await this.templateService.update(
        { id: mysteryBoxEntity.templateId },
        { templateStatus: TemplateStatus.INACTIVE },
        userEntity,
      );
      Object.assign(mysteryBoxEntity, { mysteryBoxStatus: MysteryBoxStatus.INACTIVE });
      return mysteryBoxEntity.save();
    } else {
      await this.templateService.delete({ id: mysteryBoxEntity.templateId }, userEntity);
      return mysteryBoxEntity.remove();
    }
  }

  public async deactivateBoxes(assets: Array<AssetEntity>): Promise<DeleteResult> {
    const mysteryBoxEntities = await this.mysteryBoxEntityRepository.find({
      where: [
        {
          item: In(assets.map(asset => asset.id)),
        },
        {
          template: {
            price: In(assets.map(asset => asset.id)),
          },
        },
      ],
    });

    for (const mysteryBoxEntity of mysteryBoxEntities) {
      await this.templateDeleteService.deactivateTemplate(mysteryBoxEntity.template);
    }

    await this.claimTemplateService.deactivateClaims(mysteryBoxEntities.map(mysteryBoxEntity => mysteryBoxEntity.item));

    return await this.mysteryBoxEntityRepository.delete({
      id: In(mysteryBoxEntities.map(mb => mb.id)),
    });
  }
}
