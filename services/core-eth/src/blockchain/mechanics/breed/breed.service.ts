import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { BreedEntity } from "./breed.entity";

@Injectable()
export class BreedService {
  constructor(
    @InjectRepository(BreedEntity)
    private readonly breedEntityRepository: Repository<BreedEntity>,
  ) {}

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

  public async create(dto: DeepPartial<BreedEntity>): Promise<BreedEntity> {
    return this.breedEntityRepository.create(dto).save();
  }

  public async append(tokenId: number): Promise<BreedEntity> {
    const breedEntity = await this.findOne({ tokenId });

    if (!breedEntity) {
      return this.create({
        tokenId,
        count: 1,
      });
    }

    breedEntity.count += 1;
    return breedEntity.save();
  }
}
