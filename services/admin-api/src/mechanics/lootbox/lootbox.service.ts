import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ILootboxSearchDto, LootboxStatus } from "@framework/types";

import { TemplateService } from "../../blockchain/hierarchy/template/template.service";
import { AssetService } from "../asset/asset.service";

import { LootboxEntity } from "./lootbox.entity";
import { ILootboxCreateDto, ILootboxUpdateDto } from "./interfaces";
import { ContractService } from "../../blockchain/hierarchy/contract/contract.service";

@Injectable()
export class LootboxService {
  constructor(
    @InjectRepository(LootboxEntity)
    private readonly lootboxEntityRepository: Repository<LootboxEntity>,
    private readonly templateService: TemplateService,
    private readonly contractService: ContractService,
    private readonly assetService: AssetService,
  ) {}

  public async search(dto: ILootboxSearchDto): Promise<[Array<LootboxEntity>, number]> {
    const { query, lootboxStatus, skip, take } = dto;

    const queryBuilder = this.lootboxEntityRepository.createQueryBuilder("lootbox");

    queryBuilder.select();

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(lootbox.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("lootbox.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (lootboxStatus) {
      if (lootboxStatus.length === 1) {
        queryBuilder.andWhere("lootbox.lootboxStatus = :lootboxStatus", { lootboxStatus: lootboxStatus[0] });
      } else {
        queryBuilder.andWhere("lootbox.lootboxStatus IN(:...lootboxStatus)", { lootboxStatus });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "lootbox.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(): Promise<Array<LootboxEntity>> {
    return this.lootboxEntityRepository.find({
      select: {
        id: true,
        title: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<LootboxEntity>,
    options?: FindOneOptions<LootboxEntity>,
  ): Promise<LootboxEntity | null> {
    return this.lootboxEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<LootboxEntity>): Promise<LootboxEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "lootbox",
        leftJoinAndSelect: {
          item: "lootbox.item",
          item_components: "item.components",
          item_contract: "item_components.contract",
          item_template: "item_components.template",
          price: "lootbox.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          price_template: "price_components.template",
        },
      },
    });
  }

  public async update(where: FindOptionsWhere<LootboxEntity>, dto: Partial<ILootboxUpdateDto>): Promise<LootboxEntity> {
    const { price, item, ...rest } = dto;

    const lootboxEntity = await this.findOne(where, {
      join: {
        alias: "lootbox",
        leftJoinAndSelect: {
          price: "lootbox.price",
          price_components: "price.components",
          item: "lootbox.item",
          item_components: "item.components",
        },
      },
    });

    if (!lootboxEntity) {
      throw new NotFoundException("lootboxNotFound");
    }

    Object.assign(lootboxEntity, rest);

    if (price) {
      await this.assetService.update(lootboxEntity.price, price);
    }

    if (item) {
      await this.assetService.update(lootboxEntity.item, item);
    }

    return lootboxEntity.save();
  }

  public async create(dto: ILootboxCreateDto): Promise<LootboxEntity> {
    const { price, item } = dto;

    const priceEntity = await this.assetService.create({
      components: [],
    });

    await this.assetService.update(priceEntity, price);

    const itemEntity = await this.assetService.create({
      components: [],
    });
    await this.assetService.update(itemEntity, item);

    Object.assign(dto, { price: priceEntity, item: itemEntity });

    const contractEntity = await this.contractService.findOne({ address: process.env.LOOTBOX_ADDR });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const templateEntity = await this.templateService.create({
      title: dto.title,
      description: dto.description,
      price: priceEntity,
      amount: "0",
      imageUrl: dto.imageUrl,
      contractId: contractEntity.id,
    });

    return this.lootboxEntityRepository.create({ ...dto, template: templateEntity }).save();
  }

  public async delete(where: FindOptionsWhere<LootboxEntity>): Promise<LootboxEntity> {
    return this.update(where, { lootboxStatus: LootboxStatus.INACTIVE });
  }
}
