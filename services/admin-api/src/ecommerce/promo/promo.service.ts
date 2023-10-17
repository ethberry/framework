import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindManyOptions, FindOptionsWhere, Repository } from "typeorm";

import { ProductPromoEntity } from "./promo.entity";
import type { IProductPromoCreateDto, IProductPromoSearchDto, IProductPromoUpdateDto } from "./interfaces";

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
      relations: ["product"],
      ...options,
    });
  }

  public async search(dto: Partial<IProductPromoSearchDto>): Promise<[Array<ProductPromoEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.productPromoEntityRepository.createQueryBuilder("promo");

    queryBuilder.select();

    if (query) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("promo.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("promo.description ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.leftJoinAndSelect("promo.product", "product");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("promo.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public async update(
    where: FindOptionsWhere<ProductPromoEntity>,
    data: IProductPromoUpdateDto,
  ): Promise<ProductPromoEntity | undefined> {
    const promoEntity = await this.productPromoEntityRepository.findOne({ where });

    if (!promoEntity) {
      throw new NotFoundException("promoNotFound");
    }

    Object.assign(promoEntity, data);
    return promoEntity.save();
  }

  public create(data: IProductPromoCreateDto): Promise<ProductPromoEntity> {
    return this.productPromoEntityRepository.create({ ...data }).save();
  }

  public async delete(where: FindOptionsWhere<ProductPromoEntity>): Promise<void> {
    // TODO delete images
    await this.productPromoEntityRepository.delete(where);
  }
}
