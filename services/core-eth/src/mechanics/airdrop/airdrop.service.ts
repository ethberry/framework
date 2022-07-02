import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { AirdropEntity } from "./airdrop.entity";

@Injectable()
export class AirdropService {
  constructor(
    @InjectRepository(AirdropEntity)
    private readonly airdropEntityRepository: Repository<AirdropEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<AirdropEntity>,
    options?: FindOneOptions<AirdropEntity>,
  ): Promise<AirdropEntity | null> {
    return this.airdropEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<AirdropEntity>): Promise<AirdropEntity> {
    return this.airdropEntityRepository.create(dto).save();
  }

  public async update(where: FindOptionsWhere<AirdropEntity>, dto: DeepPartial<AirdropEntity>): Promise<AirdropEntity> {
    const { ...rest } = dto;

    const tokenEntity = await this.findOne(where);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(tokenEntity, rest);

    return tokenEntity.save();
  }
}
