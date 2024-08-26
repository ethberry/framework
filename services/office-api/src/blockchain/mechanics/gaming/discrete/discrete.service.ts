import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DeleteResult, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import type { IDiscreteCreateDto, IDiscreteSearchDto, IDiscreteUpdateDto } from "@framework/types";
import { DiscreteStatus } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { AssetService } from "../../../exchange/asset/asset.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { DiscreteEntity } from "./discrete.entity";
import { AssetEntity } from "../../../exchange/asset/asset.entity";

@Injectable()
export class DiscreteService {
  constructor(
    @InjectRepository(DiscreteEntity)
    protected readonly discreteEntityRepository: Repository<DiscreteEntity>,
    protected readonly assetService: AssetService,
    protected readonly contractService: ContractService,
    protected readonly tokenService: TokenService,
  ) {}

  public async search(
    dto: Partial<IDiscreteSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<DiscreteEntity>, number]> {
    const { query, discreteStatus, merchantId, skip, take } = dto;

    const queryBuilder = this.discreteEntityRepository.createQueryBuilder("discrete");

    queryBuilder.leftJoinAndSelect("discrete.contract", "contract");

    queryBuilder.andWhere("contract.merchantId = :merchantId", {
      merchantId,
    });

    queryBuilder.andWhere("contract.chainId = :chainId", {
      chainId: userEntity.chainId,
    });

    if (discreteStatus) {
      if (discreteStatus.length === 1) {
        queryBuilder.andWhere("discrete.discreteStatus = :discreteStatus", { discreteStatus: discreteStatus[0] });
      } else {
        queryBuilder.andWhere("discrete.discreteStatus IN(:...discreteStatus)", { discreteStatus });
      }
    }

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(contract.description->'blocks')`;
          return qb;
        },
        "blocks",
        "TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("contract.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.select();

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "discrete.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<DiscreteEntity>,
    options?: FindOneOptions<DiscreteEntity>,
  ): Promise<DiscreteEntity | null> {
    return this.discreteEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IDiscreteCreateDto, userEntity: UserEntity): Promise<DiscreteEntity> {
    const { contractId, /* attribute, */ price } = dto;

    const contractEntity = await this.contractService.findOne({
      id: contractId,
    });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    if (contractEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const assetEntity = await this.assetService.create();
    await this.assetService.update(assetEntity, price, userEntity);

    return this.discreteEntityRepository
      .create({
        ...dto,
        price: assetEntity,
      })
      .save();
  }

  public async update(
    where: FindOptionsWhere<DiscreteEntity>,
    dto: Partial<IDiscreteUpdateDto>,
    userEntity: UserEntity,
  ): Promise<DiscreteEntity> {
    const { price, ...rest } = dto;

    const discreteEntity = await this.findOne(where, {
      relations: {
        contract: true,
        price: {
          components: true,
        },
      },
    });

    if (!discreteEntity) {
      throw new NotFoundException("discreteNotFound");
    }

    if (discreteEntity.contract.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    if (price) {
      await this.assetService.update(discreteEntity.price, price, userEntity);
    }

    Object.assign(discreteEntity, rest);
    return discreteEntity.save();
  }

  public findOneWithRelations(where: FindOptionsWhere<DiscreteEntity>): Promise<DiscreteEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "discrete",
        leftJoinAndSelect: {
          contract: "discrete.contract",
          price: "discrete.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          price_template: "price_components.template",
        },
      },
    });
  }

  public delete(where: FindOptionsWhere<DiscreteEntity>, userEntity: UserEntity): Promise<DiscreteEntity> {
    return this.update(where, { discreteStatus: DiscreteStatus.INACTIVE }, userEntity);
  }

  public async deactivateDiscrete(assets: Array<AssetEntity>): Promise<DeleteResult> {
    const discreteEntities = await this.discreteEntityRepository.find({
      where: {
        priceId: In(assets.map(asset => asset.id)),
      },
    });

    return this.discreteEntityRepository.delete({
      id: In(discreteEntities.map(g => g.id)),
    });
  }
}
