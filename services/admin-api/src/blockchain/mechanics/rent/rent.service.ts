import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IPaginationDto } from "@gemunion/types-collection";

import { RentEntity } from "./rent.entity";
import { IRentUpdateDto } from "./interfaces";
import { AssetService } from "../../exchange/asset/asset.service";

@Injectable()
export class RentService {
  constructor(
    @InjectRepository(RentEntity)
    private readonly rentEntityRepository: Repository<RentEntity>,
    protected readonly assetService: AssetService,
  ) {}

  public async search(dto: IPaginationDto): Promise<[Array<RentEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.rentEntityRepository.createQueryBuilder("rent");

    queryBuilder.leftJoinAndSelect("rent.contract", "contract");

    queryBuilder.select();

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

  public async update(where: FindOptionsWhere<RentEntity>, dto: Partial<IRentUpdateDto>): Promise<RentEntity> {
    const { price, ...rest } = dto;
    const templateEntity = await this.findOne(where, {
      join: {
        alias: "rent",
        leftJoinAndSelect: {
          price: "rent.price",
          components: "price.components",
        },
      },
    });

    if (!templateEntity) {
      throw new NotFoundException("rentNotFound");
    }

    if (price) {
      await this.assetService.update(templateEntity.price, price);
    }

    Object.assign(templateEntity, rest);

    return templateEntity.save();
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
