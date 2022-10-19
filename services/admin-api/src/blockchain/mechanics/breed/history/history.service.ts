import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import type { IPaginationDto } from "@gemunion/types-collection";
import { BreedHistoryEntity } from "./history.entity";

@Injectable()
export class BreedHistoryService {
  constructor(
    @InjectRepository(BreedHistoryEntity)
    private readonly breedHistoryEntityRepository: Repository<BreedHistoryEntity>,
  ) {}

  public async search(dto: Partial<IPaginationDto>): Promise<[Array<BreedHistoryEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.breedHistoryEntityRepository.createQueryBuilder("history");

    queryBuilder.select();

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("history.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(): Promise<Array<BreedHistoryEntity>> {
    const queryBuilder = this.breedHistoryEntityRepository.createQueryBuilder("history");

    queryBuilder.select(["id", "id::VARCHAR as title"]);

    queryBuilder.orderBy({
      "history.createdAt": "DESC",
    });

    return queryBuilder.getRawMany();
  }

  public findOneWithRelations(where: FindOptionsWhere<BreedHistoryEntity>): Promise<BreedHistoryEntity | null> {
    return this.findOne(where, {
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

  public findOne(
    where: FindOptionsWhere<BreedHistoryEntity>,
    options?: FindOneOptions<BreedHistoryEntity>,
  ): Promise<BreedHistoryEntity | null> {
    return this.breedHistoryEntityRepository.findOne({ where, ...options });
  }
}
