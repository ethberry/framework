import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import type { IPaginationDto } from "@gemunion/types-collection";
import { BreedEntity } from "./breed.entity";
import { BreedHistoryEntity } from "./history.entity";
import { LotteryRoundEntity } from "../lottery/round/round.entity";

@Injectable()
export class BreedService {
  constructor(
    @InjectRepository(BreedEntity)
    private readonly breedEntityRepository: Repository<BreedEntity>,
    @InjectRepository(BreedHistoryEntity)
    private readonly breedHistoryEntityRepository: Repository<BreedHistoryEntity>,
  ) {}

  public async searchBreed(dto: Partial<IPaginationDto>): Promise<[Array<BreedEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.breedEntityRepository.createQueryBuilder("breed");

    queryBuilder.select();

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("breed.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public async searchHistory(dto: Partial<IPaginationDto>): Promise<[Array<BreedHistoryEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.breedHistoryEntityRepository.createQueryBuilder("history");

    queryBuilder.select();

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("history.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public async autocompleteHistory(): Promise<Array<BreedHistoryEntity>> {
    const queryBuilder = this.breedHistoryEntityRepository.createQueryBuilder("history");

    queryBuilder.select(["id", "id::VARCHAR as title"]);

    queryBuilder.orderBy({
      "history.createdAt": "DESC",
    });

    return queryBuilder.getRawMany();
  }

  public findOneWithRelationsBreed(where: FindOptionsWhere<BreedEntity>): Promise<BreedEntity | null> {
    return this.findOneBreed(where, {
      join: {
        alias: "breed",
        leftJoinAndSelect: {
          token: "breed.token",
          template: "token.template",
          contract: "template.contract",
        },
      },
    });
  }

  public findOneWithRelationsHistory(where: FindOptionsWhere<BreedHistoryEntity>): Promise<BreedHistoryEntity | null> {
    return this.findOneHistory(where, {
      join: {
        alias: "breeds",
        leftJoinAndSelect: {
          child: "breeds.child",
          matron: "breeds.matron",
          sire: "breeds.sire",
          exchange_history: "breeds.history",
        },
      },
    });
  }

  public findOneBreed(
    where: FindOptionsWhere<BreedEntity>,
    options?: FindOneOptions<BreedEntity>,
  ): Promise<BreedEntity | null> {
    return this.breedEntityRepository.findOne({ where, ...options });
  }

  public findOneHistory(
    where: FindOptionsWhere<BreedHistoryEntity>,
    options?: FindOneOptions<BreedHistoryEntity>,
  ): Promise<BreedHistoryEntity | null> {
    return this.breedHistoryEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<BreedEntity>,
    options?: FindOneOptions<BreedEntity>,
  ): Promise<Array<BreedEntity>> {
    return this.breedEntityRepository.find({ where, ...options });
  }
}
