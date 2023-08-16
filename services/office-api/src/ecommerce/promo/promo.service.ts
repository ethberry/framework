import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindManyOptions, FindOptionsWhere, Repository } from "typeorm";

import { PromoEntity } from "./promo.entity";
import type { IPromoCreateDto, IPromoSearchDto, IPromoUpdateDto } from "./interfaces";

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
      relations: ["product"],
      ...options,
    });
  }

  public async search(dto: IPromoSearchDto): Promise<[Array<PromoEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.promoEntityRepository.createQueryBuilder("promo");

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

  public async update(where: FindOptionsWhere<PromoEntity>, data: IPromoUpdateDto): Promise<PromoEntity | undefined> {
    const promoEntity = await this.promoEntityRepository.findOne({ where });

    if (!promoEntity) {
      throw new NotFoundException("promoNotFound");
    }

    Object.assign(promoEntity, data);
    return promoEntity.save();
  }

  public create(data: IPromoCreateDto): Promise<PromoEntity> {
    return this.promoEntityRepository.create({ ...data }).save();
  }

  public async delete(where: FindOptionsWhere<PromoEntity>): Promise<void> {
    // TODO delete images
    await this.promoEntityRepository.delete(where);
  }
}
