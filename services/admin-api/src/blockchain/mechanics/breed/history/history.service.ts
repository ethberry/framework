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

    queryBuilder.leftJoinAndSelect("history.child", "child");
    queryBuilder.leftJoinAndSelect("child.token", "child_token");
    queryBuilder.leftJoinAndSelect("child_token.template", "child_template");

    queryBuilder.leftJoinAndSelect("history.matron", "matron");
    queryBuilder.leftJoinAndSelect("matron.token", "matron_token");
    queryBuilder.leftJoinAndSelect("matron_token.template", "matron_template");

    queryBuilder.leftJoinAndSelect("history.sire", "sire");
    queryBuilder.leftJoinAndSelect("sire.token", "sire_token");
    queryBuilder.leftJoinAndSelect("sire_token.template", "sire_template");

    queryBuilder.leftJoinAndSelect("history.history", "exchange_history");

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
          child_token: "child.token",
          child_template: "child_token.template",
          matron: "breeds.matron",
          matron_token: "matron.token",
          matron_template: "matron_token.template",
          sire: "breeds.sire",
          sire_token: "sire.token",
          sire_template: "sire_token.template",
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
