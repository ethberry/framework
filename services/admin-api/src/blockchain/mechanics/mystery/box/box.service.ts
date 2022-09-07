import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IMysteryboxSearchDto, MysteryboxStatus } from "@framework/types";

import { TemplateService } from "../../../hierarchy/template/template.service";
import { AssetService } from "../../asset/asset.service";

import { MysteryBoxEntity } from "./box.entity";
import { IMysteryboxCreateDto, IMysteryboxUpdateDto } from "./interfaces";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class MysteryBoxService {
  constructor(
    @InjectRepository(MysteryBoxEntity)
    private readonly mysteryboxEntityRepository: Repository<MysteryBoxEntity>,
    private readonly templateService: TemplateService,
    private readonly contractService: ContractService,
    private readonly assetService: AssetService,
  ) {}

  public async search(dto: IMysteryboxSearchDto): Promise<[Array<MysteryBoxEntity>, number]> {
    const { query, mysteryboxStatus, skip, take } = dto;

    const queryBuilder = this.mysteryboxEntityRepository.createQueryBuilder("mysterybox");

    queryBuilder.select();

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(mysterybox.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("mysterybox.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (mysteryboxStatus) {
      if (mysteryboxStatus.length === 1) {
        queryBuilder.andWhere("mysterybox.mysteryboxStatus = :mysteryboxStatus", {
          mysteryboxStatus: mysteryboxStatus[0],
        });
      } else {
        queryBuilder.andWhere("mysterybox.mysteryboxStatus IN(:...mysteryboxStatus)", { mysteryboxStatus });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "mysterybox.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(): Promise<Array<MysteryBoxEntity>> {
    return this.mysteryboxEntityRepository.find({
      select: {
        id: true,
        title: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<MysteryBoxEntity>,
    options?: FindOneOptions<MysteryBoxEntity>,
  ): Promise<MysteryBoxEntity | null> {
    return this.mysteryboxEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<MysteryBoxEntity>): Promise<MysteryBoxEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "mysterybox",
        leftJoinAndSelect: {
          template: "mysterybox.template",
          item: "mysterybox.item",
          item_components: "item.components",
          item_contract: "item_components.contract",
          item_template: "item_components.template",
          price: "template.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          price_template: "price_components.template",
        },
      },
    });
  }

  public async update(
    where: FindOptionsWhere<MysteryBoxEntity>,
    dto: Partial<IMysteryboxUpdateDto>,
  ): Promise<MysteryBoxEntity> {
    const { price, item, ...rest } = dto;

    const mysteryboxEntity = await this.findOne(where, {
      join: {
        alias: "mysterybox",
        leftJoinAndSelect: {
          template: "mysterybox.template",
          item: "mysterybox.item",
          item_components: "item.components",
          price: "template.price",
          price_components: "price.components",
        },
      },
    });

    if (!mysteryboxEntity) {
      throw new NotFoundException("mysteryboxNotFound");
    }

    Object.assign(mysteryboxEntity, rest);

    if (price) {
      await this.assetService.update(mysteryboxEntity.template.price, price);
    }

    if (item) {
      await this.assetService.update(mysteryboxEntity.item, item);
    }

    return mysteryboxEntity.save();
  }

  public async create(dto: IMysteryboxCreateDto): Promise<MysteryBoxEntity> {
    const { price, item, contractId } = dto;

    const priceEntity = await this.assetService.create({
      components: [],
    });
    await this.assetService.update(priceEntity, price);

    const itemEntity = await this.assetService.create({
      components: [],
    });
    await this.assetService.update(itemEntity, item);

    Object.assign(dto, { price: priceEntity, item: itemEntity });

    const contractEntity = await this.contractService.findOne({ id: contractId });

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

    return this.mysteryboxEntityRepository.create({ ...dto, template: templateEntity }).save();
  }

  public async delete(where: FindOptionsWhere<MysteryBoxEntity>): Promise<MysteryBoxEntity> {
    return this.update(where, { mysteryboxStatus: MysteryboxStatus.INACTIVE });
  }
}
