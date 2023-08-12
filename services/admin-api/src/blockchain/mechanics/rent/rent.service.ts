import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IRentSearchDto } from "@framework/types";
import { RentRuleStatus } from "@framework/types";

import { UserEntity } from "../../../infrastructure/user/user.entity";
import { AssetService } from "../../exchange/asset/asset.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import type { IRentCreateDto, IRentUpdateDto } from "./interfaces";
import { RentEntity } from "./rent.entity";

@Injectable()
export class RentService {
  constructor(
    @InjectRepository(RentEntity)
    private readonly rentEntityRepository: Repository<RentEntity>,
    protected readonly assetService: AssetService,
    protected readonly contractService: ContractService,
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

  public async create(dto: IRentCreateDto, userEntity: UserEntity): Promise<RentEntity> {
    const { price, title, contractId } = dto;

    const contractEntity = await this.contractService.findOne({ id: contractId });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    if (contractEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const priceEntity = await this.assetService.create();
    await this.assetService.update(priceEntity, price, userEntity);

    return this.rentEntityRepository
      .create({
        price: priceEntity,
        title,
        contractId,
        rentStatus: RentRuleStatus.NEW,
      })
      .save();
  }

  public async update(
    where: FindOptionsWhere<RentEntity>,
    dto: Partial<IRentUpdateDto>,
    userEntity: UserEntity,
  ): Promise<RentEntity> {
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
      await this.assetService.update(rentEntity.price, price, userEntity);
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
