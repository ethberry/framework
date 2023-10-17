import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOptionsWhere, Repository } from "typeorm";

import { ProductPromoEntity } from "./promo.entity";

@Injectable()
export class ProductPromoService {
  constructor(
    @InjectRepository(ProductPromoEntity)
    private readonly productPromoEntityRepository: Repository<ProductPromoEntity>,
  ) {}

  public findAndCount(
    where: FindOptionsWhere<ProductPromoEntity>,
    options?: FindManyOptions<ProductPromoEntity>,
  ): Promise<[Array<ProductPromoEntity>, number]> {
    return this.productPromoEntityRepository.findAndCount({
      where,
      relations: { product: true },
      ...options,
    });
  }
}
