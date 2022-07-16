import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { AssetType, ILootboxSearchDto, LootboxStatus } from "@framework/types";

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

  public findOne(
    where: FindOptionsWhere<LootboxEntity>,
    options?: FindOneOptions<LootboxEntity>,
  ): Promise<LootboxEntity | null> {
    return this.lootboxEntityRepository.findOne({ where, ...options });
  }

  public async search(dto: ILootboxSearchDto): Promise<[Array<LootboxEntity>, number]> {
    const { query, lootboxStatus, skip, take, contractIds } = dto;

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

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("lootbox.contractId = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("lootbox.contractId IN(:...contractIds)", { contractIds });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "lootbox.title": "ASC",
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

  public async update(where: FindOptionsWhere<LootboxEntity>, dto: Partial<ILootboxUpdateDto>): Promise<LootboxEntity> {
    const templateEntity = await this.findOne(where);

    if (!templateEntity) {
      throw new NotFoundException("lootboxNotFound");
    }

    Object.assign(templateEntity, dto);

    return templateEntity.save();
  }

  public async create(dto: ILootboxCreateDto): Promise<LootboxEntity> {
    const { price, item } = dto;
    console.log("item", item);

    const priceEntity = await this.assetService.create({
      assetType: AssetType.LOOTBOX,
      externalId: "0",
      components: [],
    });

    await this.assetService.update(priceEntity, price);

    const itemEntity = await this.assetService.create({
      assetType: AssetType.LOOTBOX,
      externalId: "0",
      components: [],
    });
    await this.assetService.update(itemEntity, item);

    Object.assign(dto, { price: priceEntity, item: itemEntity });

    const contractEntity = await this.contractService.findOne({ address: process.env.LOOTBOX_ADDR });

    if (!contractEntity) {
      throw new NotFoundException("lootboxContractNotFound");
    }

    const lootboxTemplate = {
      title: dto.title,
      description: dto.description,
      price: priceEntity,
      amount: "0",
      imageUrl: dto.imageUrl,
      contractId: contractEntity.id,
    };

    await this.templateService.create(lootboxTemplate);

    return this.lootboxEntityRepository.create(dto).save();
  }

  public async delete(where: FindOptionsWhere<LootboxEntity>): Promise<LootboxEntity> {
    return this.update(where, { lootboxStatus: LootboxStatus.INACTIVE });
  }
}
