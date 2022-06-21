import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IStakingSearchDto, StakingStatus, TokenType } from "@framework/types";

import { StakingEntity } from "./staking.entity";
import { IStakingCreateDto, IStakingUpdateDto } from "./interfaces";
import { Erc20TokenEntity } from "../../erc20/token/token.entity";
import { Erc721CollectionEntity } from "../../erc721/collection/collection.entity";
import { Erc1155CollectionEntity } from "../../erc1155/collection/collection.entity";
import { Erc998CollectionEntity } from "../../erc998/collection/collection.entity";

@Injectable()
export class StakingService {
  constructor(
    @InjectRepository(StakingEntity)
    private readonly stakingEntityRepository: Repository<StakingEntity>,
  ) {}

  public search(dto: IStakingSearchDto): Promise<[Array<StakingEntity>, number]> {
    const { query, deposit, reward, stakingStatus, skip, take } = dto;

    const queryBuilder = this.stakingEntityRepository.createQueryBuilder("staking");
    queryBuilder.leftJoinAndSelect("staking.deposit", "deposit");
    queryBuilder.leftJoinAndSelect("staking.reward", "reward");

    queryBuilder.leftJoinAndMapOne(
      "reward.erc20",
      Erc20TokenEntity,
      "reward_erc20_token",
      `reward.collection = reward_erc20_token.id and reward.tokenType = '${TokenType.ERC20}'`,
    );

    queryBuilder.leftJoinAndMapOne(
      "reward.erc721",
      Erc721CollectionEntity,
      "reward_erc721_collection",
      `reward.collection = reward_erc721_collection.id and (reward.tokenType = '${TokenType.ERC721}' or reward.tokenType = '${TokenType.ERC721D}')`,
    );

    queryBuilder.leftJoinAndMapOne(
      "reward.erc998",
      Erc998CollectionEntity,
      "reward_erc998_collection",
      `reward.collection = reward_erc998_collection.id and (reward.tokenType = '${TokenType.ERC998}' or reward.tokenType = '${TokenType.ERC998D}')`,
    );

    queryBuilder.leftJoinAndMapOne(
      "reward.erc1155",
      Erc1155CollectionEntity,
      "reward_erc1155_collection",
      `reward.collection = reward_erc1155_collection.id and reward.tokenType = '${TokenType.ERC1155}'`,
    );

    queryBuilder.leftJoinAndMapOne(
      "deposit.erc20",
      Erc20TokenEntity,
      "deposit_erc20_token",
      `deposit.collection = deposit_erc20_token.id and deposit.tokenType = '${TokenType.ERC20}'`,
    );

    queryBuilder.leftJoinAndMapOne(
      "deposit.erc721",
      Erc721CollectionEntity,
      "deposit_erc721_collection",
      `deposit.collection = deposit_erc721_collection.id and (deposit.tokenType = '${TokenType.ERC721}' or deposit.tokenType = '${TokenType.ERC721D}')`,
    );

    queryBuilder.leftJoinAndMapOne(
      "deposit.erc998",
      Erc998CollectionEntity,
      "deposit_erc998_collection",
      `deposit.collection = deposit_erc998_collection.id and (deposit.tokenType = '${TokenType.ERC998}' or deposit.tokenType = '${TokenType.ERC998D}')`,
    );

    queryBuilder.leftJoinAndMapOne(
      "deposit.erc1155",
      Erc1155CollectionEntity,
      "deposit_erc1155_collection",
      `deposit.collection = deposit_erc1155_collection.id and deposit.tokenType = '${TokenType.ERC1155}'`,
    );

    queryBuilder.select();

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(staking.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("staking.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (stakingStatus) {
      if (stakingStatus.length === 1) {
        queryBuilder.andWhere("staking.stakingStatus = :stakingStatus", { stakingStatus: stakingStatus[0] });
      } else {
        queryBuilder.andWhere("staking.stakingStatus IN(:...stakingStatus)", { stakingStatus });
      }
    }

    if (deposit && deposit.tokenType) {
      if (deposit.tokenType.length === 1) {
        queryBuilder.andWhere("deposit.tokenType = :depositTokenType", { depositTokenType: deposit.tokenType[0] });
      } else {
        queryBuilder.andWhere("deposit.tokenType IN(:...depositTokenType)", { depositTokenType: deposit.tokenType });
      }
    }

    if (reward && reward.tokenType) {
      if (reward.tokenType.length === 1) {
        queryBuilder.andWhere("reward.tokenType = :rewardTokenType", { rewardTokenType: reward.tokenType[0] });
      } else {
        queryBuilder.andWhere("reward.tokenType IN(:...rewardTokenType)", { rewardTokenType: reward.tokenType });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "staking.id": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<StakingEntity>,
    options?: FindOneOptions<StakingEntity>,
  ): Promise<StakingEntity | null> {
    return this.stakingEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IStakingCreateDto): Promise<StakingEntity> {
    return this.stakingEntityRepository.create(dto).save();
  }

  public async update(where: FindOptionsWhere<StakingEntity>, dto: IStakingUpdateDto): Promise<StakingEntity> {
    const { reward, deposit, ...rest } = dto;
    const stakingEntity = await this.findOne(where, { relations: { deposit: true, reward: true } });

    if (!stakingEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(stakingEntity.deposit, deposit);
    Object.assign(stakingEntity.reward, reward);

    Object.assign(stakingEntity, rest);

    return stakingEntity.save();
  }

  public async delete(where: FindOptionsWhere<StakingEntity>): Promise<void> {
    const stakingEntity = await this.findOne(where);

    if (!stakingEntity) {
      return;
    }

    if (stakingEntity.stakingStatus === StakingStatus.NEW) {
      await stakingEntity.remove();
    } else {
      Object.assign(stakingEntity, { recipeStatus: StakingStatus.INACTIVE });
      await stakingEntity.save();
    }
  }
}
