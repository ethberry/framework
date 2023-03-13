import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

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
}
