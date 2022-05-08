import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

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
}
