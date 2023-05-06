import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { WeiPerEther } from "ethers";

import type { IPaginationDto } from "@gemunion/types-collection";

import { RentEntity } from "./rent.entity";
import { AssetService } from "../../exchange/asset/asset.service";
import { TokenType } from "@framework/types";

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

  public async create(dto: DeepPartial<RentEntity>): Promise<RentEntity> {
    // ERC20_SIMPLE 1 ETH
    const assetEntity = await this.assetService.create({
      components: [
        {
          tokenType: TokenType.ERC20,
          contractId: 1201,
          templateId: 120101,
          amount: WeiPerEther.toString(),
        },
      ],
    });

    Object.assign(dto, {
      price: assetEntity,
    });

    return this.rentEntityRepository.create(dto).save();
  }
}
