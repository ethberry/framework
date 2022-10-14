import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import type { IPaginationDto } from "@gemunion/types-collection";
import { BreedEntity } from "./breed.entity";

@Injectable()
export class BreedService {
  constructor(
    @InjectRepository(BreedEntity)
    private readonly breedEntityRepository: Repository<BreedEntity>,
  ) {}

  public async search(dto: Partial<IPaginationDto>): Promise<[Array<BreedEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.breedEntityRepository.createQueryBuilder("breed");

    queryBuilder.select();

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("breed.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public findOneWithRelations(where: FindOptionsWhere<BreedEntity>): Promise<BreedEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "breed",
        leftJoinAndSelect: {
          token: "breed.token",
          template: "token.template",
          contract: "template.contract",
          childs: "breed.childs",
          childs_matron: "childs.matron",
          childs_sire: "childs.sire",
          matrons: "breed.matrons",
          matrons_breed: "matrons.child",
          sires: "breed.sires",
          sires_breed: "sires.child",
        },
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<BreedEntity>,
    options?: FindOneOptions<BreedEntity>,
  ): Promise<BreedEntity | null> {
    return this.breedEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<BreedEntity>,
    options?: FindOneOptions<BreedEntity>,
  ): Promise<Array<BreedEntity>> {
    return this.breedEntityRepository.find({ where, ...options });
  }
}
