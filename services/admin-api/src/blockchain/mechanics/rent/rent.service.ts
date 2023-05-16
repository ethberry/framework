import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { RentEntity } from "./rent.entity";
import { IRentCreateDto, IRentUpdateDto } from "./interfaces";
import { AssetService } from "../../exchange/asset/asset.service";
import { IRentSearchDto, RentRuleStatus } from "@framework/types";

@Injectable()
export class RentService {
  constructor(
    @InjectRepository(RentEntity)
    private readonly rentEntityRepository: Repository<RentEntity>,
    protected readonly assetService: AssetService,
  ) {}

  public async search(dto: IRentSearchDto): Promise<[Array<RentEntity>, number]> {
    const { query, rentStatus, contractIds, skip, take } = dto;
    const queryBuilder = this.rentEntityRepository.createQueryBuilder("rent");

    queryBuilder.leftJoinAndSelect("rent.contract", "contract");

    queryBuilder.select();

    if (query) {
      queryBuilder.andWhere("rent.title ILIKE '%' || :title || '%'", { title: query });
    }

    if (rentStatus) {
      if (rentStatus.length === 1) {
        queryBuilder.andWhere("rent.rentStatus = :rentStatus", { rentStatus: rentStatus[0] });
      } else {
        queryBuilder.andWhere("rent.rentStatus IN(:...rentStatus)", { rentStatus });
      }
    }

    if (contractIds) {
      if (contractIds.length === 1) {
        queryBuilder.andWhere("rent.contractId = :contractId", {
          contractId: contractIds[0],
        });
      } else {
        queryBuilder.andWhere("rent.contractId IN(:...contractIds)", { contractIds });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "rent.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<RentEntity>,
    options?: FindOneOptions<RentEntity>,
  ): Promise<RentEntity | null> {
    return this.rentEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IRentCreateDto): Promise<RentEntity> {
    const { price, title, contractId, rentStatus } = dto;

    // add new price
    const priceEntity = await this.assetService.create({
      components: [],
    });
    await this.assetService.update(priceEntity, price);

    return this.rentEntityRepository
      .create({
        price: priceEntity,
        title,
        contractId,
        rentStatus: rentStatus || RentRuleStatus.NEW,
      })
      .save();
  }

  public async update(where: FindOptionsWhere<RentEntity>, dto: Partial<IRentUpdateDto>): Promise<RentEntity> {
    const { price, ...rest } = dto;
    const rentEntity = await this.findOne(where, {
      join: {
        alias: "rent",
        leftJoinAndSelect: {
          price: "rent.price",
          components: "price.components",
        },
      },
    });

    if (!rentEntity) {
      throw new NotFoundException("rentNotFound");
    }

    if (price) {
      await this.assetService.update(rentEntity.price, price);
    }

    Object.assign(rentEntity, rest);

    return rentEntity.save();
  }

  public findOneWithRelations(where: FindOptionsWhere<RentEntity>): Promise<RentEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "rent",
        leftJoinAndSelect: {
          contract: "rent.contract",
          price: "rent.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          price_template: "price_components.template",
        },
      },
    });
  }
}
