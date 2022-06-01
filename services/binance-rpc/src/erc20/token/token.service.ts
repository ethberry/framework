import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { Erc20TokenEntity } from "./token.entity";

@Injectable()
export class Erc20TokenService {
  constructor(
    @InjectRepository(Erc20TokenEntity)
    private readonly erc20TokenEntityRepository: Repository<Erc20TokenEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc20TokenEntity>,
    options?: FindOneOptions<Erc20TokenEntity>,
  ): Promise<Erc20TokenEntity | null> {
    return this.erc20TokenEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<Erc20TokenEntity>,
    options?: FindOneOptions<Erc20TokenEntity>,
  ): Promise<Array<Erc20TokenEntity>> {
    return this.erc20TokenEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<Erc20TokenEntity>): Promise<Erc20TokenEntity> {
    return this.erc20TokenEntityRepository.create(dto).save();
  }
}
