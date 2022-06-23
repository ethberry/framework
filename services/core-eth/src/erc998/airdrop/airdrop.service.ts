import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc998AirdropEntity } from "./airdrop.entity";

@Injectable()
export class Erc998AirdropService {
  constructor(
    @InjectRepository(Erc998AirdropEntity)
    private readonly erc998AirdropEntityRepository: Repository<Erc998AirdropEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc998AirdropEntity>,
    options?: FindOneOptions<Erc998AirdropEntity>,
  ): Promise<Erc998AirdropEntity | null> {
    return this.erc998AirdropEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<Erc998AirdropEntity>): Promise<Erc998AirdropEntity> {
    return this.erc998AirdropEntityRepository.create(dto).save();
  }

  public async update(
    where: FindOptionsWhere<Erc998AirdropEntity>,
    dto: DeepPartial<Erc998AirdropEntity>,
  ): Promise<Erc998AirdropEntity> {
    const { ...rest } = dto;

    const tokenEntity = await this.findOne(where);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(tokenEntity, rest);

    return tokenEntity.save();
  }
}
