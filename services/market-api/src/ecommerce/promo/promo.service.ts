import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOptionsWhere, Repository } from "typeorm";

import { PromoEntity } from "./promo.entity";

@Injectable()
export class PromoService {
  constructor(
    @InjectRepository(PromoEntity)
    private readonly promoEntityRepository: Repository<PromoEntity>,
  ) {}

  public findAndCount(
    where: FindOptionsWhere<PromoEntity>,
    options?: FindManyOptions<PromoEntity>,
  ): Promise<[Array<PromoEntity>, number]> {
    return this.promoEntityRepository.findAndCount({
      where,
      relations: { product: true },
      ...options,
    });
  }
}
