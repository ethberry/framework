import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOptionsWhere, FindManyOptions, Repository } from "typeorm";

import { S3Service } from "@gemunion/nest-js-module-s3";

import { PromoEntity } from "./promo.entity";
import { IPromoCreateDto, IPromoSearchDto, IPromoUpdateDto } from "./interfaces";

@Injectable()
export class PromoService {
  constructor(
    @InjectRepository(PromoEntity)
    private readonly promoEntityRepository: Repository<PromoEntity>,
    private readonly s3Service: S3Service,
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
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(promo.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("promo.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.leftJoinAndSelect("promo.product", "product");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("promo.createdAt", "DESC");

    return queryBuilder.getManyAndCount();
  }

  public async update(where: FindOptionsWhere<PromoEntity>, dto: IPromoUpdateDto): Promise<PromoEntity | null> {
    const promoEntity = await this.promoEntityRepository.findOne({ where });

    if (!promoEntity) {
      throw new NotFoundException("promoNotFound");
    }

    Object.assign(promoEntity, dto);
    return promoEntity.save();
  }

  public create(dto: IPromoCreateDto): Promise<PromoEntity> {
    return this.promoEntityRepository.create({ ...dto }).save();
  }

  public async delete(where: FindOptionsWhere<PromoEntity>): Promise<void> {
    const promoEntity = await this.promoEntityRepository.findOne({ where });

    if (!promoEntity) {
      throw new NotFoundException("promoNotFound");
    }

    await this.s3Service.deleteObject({ objectName: promoEntity.imageUrl.split("/").pop()! });

    await this.promoEntityRepository.delete(where);
  }
}
