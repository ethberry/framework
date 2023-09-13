import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ProductStatus, UserRole } from "@framework/types";

import { ProductItemEntity } from "./product-item.entity";
import type { IProductItemSearchDto } from "./interfaces";
import { UserEntity } from "../../infrastructure/user/user.entity";

@Injectable()
export class ProductItemService {
  constructor(
    @InjectRepository(ProductItemEntity)
    private readonly productItemEntityRepository: Repository<ProductItemEntity>,
  ) {}

  public async search(dto: Partial<IProductItemSearchDto>): Promise<[Array<ProductItemEntity>, number]> {
    const { query, skip, take } = dto;

    const queryBuilder = this.productItemEntityRepository.createQueryBuilder("product_item");

    queryBuilder.select();

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(product_item.description->'blocks')`;
          return qb;
        },
        `blocks`,
        `TRUE`,
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("product_item.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.leftJoinAndSelect("product.categories", "categories");
    queryBuilder.leftJoinAndSelect("product.photos", "photos");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "product.createdAt": "DESC",
      "photos.priority": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findAndCount(
    where: FindOptionsWhere<ProductItemEntity>,
    options?: FindManyOptions<ProductItemEntity>,
  ): Promise<[Array<ProductItemEntity>, number]> {
    return this.productItemEntityRepository.findAndCount({ where, ...options });
  }

  public findOne(
    where: FindOptionsWhere<ProductItemEntity>,
    options?: FindOneOptions<ProductItemEntity>,
  ): Promise<ProductItemEntity | null> {
    return this.productItemEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<ProductItemEntity>): Promise<ProductItemEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "product_item",
        leftJoinAndSelect: {
          price: "product_item.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          // categories: "product.categories",
          // photos: "product.photos",
        },
      },
      order: {
        photo: {
          priority: "ASC",
        },
      },
      relations: {
        photo: true,
      },
    });
  }

  public findAll(
    where: FindOptionsWhere<ProductItemEntity>,
    options?: FindManyOptions<ProductItemEntity>,
  ): Promise<Array<ProductItemEntity>> {
    return this.productItemEntityRepository.find({ where, ...options });
  }

  public async autocomplete(userEntity: UserEntity): Promise<Array<ProductItemEntity>> {
    const queryBuilder = this.productItemEntityRepository.createQueryBuilder("product");

    queryBuilder.select(["product.id", "product.title"]);

    queryBuilder.where("product.productStatus = :productStatus", { productStatus: ProductStatus.ACTIVE });

    if (!userEntity.userRoles.includes(UserRole.ADMIN)) {
      queryBuilder.andWhere("product.merchantId = :merchantId", {
        merchantId: userEntity.merchantId,
      });
    }

    return queryBuilder.getMany();
  }
}
