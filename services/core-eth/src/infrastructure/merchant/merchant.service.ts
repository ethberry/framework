import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { MerchantEntity } from "./merchant.entity";

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly merchantEntityRepository: Repository<MerchantEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<MerchantEntity>,
    options?: FindOneOptions<MerchantEntity>,
  ): Promise<MerchantEntity | null> {
    return this.merchantEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<MerchantEntity>,
    options?: FindManyOptions<MerchantEntity>,
  ): Promise<Array<MerchantEntity>> {
    return this.merchantEntityRepository.find({ where, ...options });
  }
}
