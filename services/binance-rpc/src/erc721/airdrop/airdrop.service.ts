import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc721AirdropEntity } from "./airdrop.entity";

@Injectable()
export class Erc721AirdropService {
  constructor(
    @InjectRepository(Erc721AirdropEntity)
    private readonly erc721AirdropEntityRepository: Repository<Erc721AirdropEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc721AirdropEntity>,
    options?: FindOneOptions<Erc721AirdropEntity>,
  ): Promise<Erc721AirdropEntity | null> {
    return this.erc721AirdropEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<Erc721AirdropEntity>): Promise<Erc721AirdropEntity> {
    return this.erc721AirdropEntityRepository.create(dto).save();
  }

  public async update(
    where: FindOptionsWhere<Erc721AirdropEntity>,
    dto: DeepPartial<Erc721AirdropEntity>,
  ): Promise<Erc721AirdropEntity> {
    const { ...rest } = dto;

    const tokenEntity = await this.findOne(where);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(tokenEntity, rest);

    return tokenEntity.save();
  }
}
