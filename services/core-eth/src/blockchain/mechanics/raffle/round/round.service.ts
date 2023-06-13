import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { RaffleRoundEntity } from "./round.entity";
// import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { AssetEntity } from "../../../exchange/asset/asset.entity";
import { AssetService } from "../../../exchange/asset/asset.service";

@Injectable()
export class RaffleRoundService {
  constructor(
    @InjectRepository(RaffleRoundEntity)
    private readonly roundEntityRepository: Repository<RaffleRoundEntity>,
    protected readonly assetService: AssetService,
  ) {}

  public findOne(
    where: FindOptionsWhere<RaffleRoundEntity>,
    options?: FindOneOptions<RaffleRoundEntity>,
  ): Promise<RaffleRoundEntity | null> {
    return this.roundEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<RaffleRoundEntity>): Promise<RaffleRoundEntity> {
    return this.roundEntityRepository.create(dto).save();
  }

  public getRound(roundId: string, address: string, chainId?: number): Promise<RaffleRoundEntity | null> {
    const queryBuilder = this.roundEntityRepository.createQueryBuilder("round");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("round.contract", "contract");

    queryBuilder.andWhere("round.roundId = :roundId", {
      roundId,
    });

    queryBuilder.andWhere("contract.address = :address", {
      address,
    });

    if (chainId) {
      queryBuilder.andWhere("contract.chainId = :chainId", {
        chainId,
      });
    }

    return queryBuilder.getOne();
  }

  public async createEmptyAsset(): Promise<AssetEntity> {
    return await this.assetService.create({
      components: [],
    });
  }
}
