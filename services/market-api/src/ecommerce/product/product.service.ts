import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { OrderStatus, PhotoStatus, ProductStatus } from "@framework/types";
import { SortDirection } from "@gemunion/types-collection";

import { OrderItemEntity } from "../order-item/order-item.entity";
import { ProductEntity } from "./product.entity";
import type { IProductSearchDto } from "./interfaces";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productEntityRepository: Repository<ProductEntity>,
  ) {}

  public async search(search: IProductSearchDto): Promise<[Array<ProductEntity>, number]> {
    const {
      query,
      field = "id",
      sort = SortDirection.asc,
      merchantId,
      categoryIds,
      parameterName,
      parameterValue,
    } = search;

    const queryBuilder = this.productEntityRepository.createQueryBuilder("product");

    queryBuilder.select();

    queryBuilder.where({ productStatus: ProductStatus.ACTIVE });

    queryBuilder.leftJoinAndSelect("product.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_template.tokens", "price_tokens");

    if (merchantId) {
      queryBuilder.andWhere("product.merchantId = :merchantId", { merchantId });
    }

    if (categoryIds) {
      queryBuilder.leftJoinAndSelect("product.categories", "category");
      queryBuilder.andWhere("category.id IN(:...categoryIds)", { categoryIds });
    }

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(product.description->'blocks')`;
          return qb;
        },
        `blocks`,
        `TRUE`,
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("product.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (parameterName && parameterValue) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(product.parameters)`;
          return qb;
        },
        `params`,
        `TRUE`,
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("params->>'parameterName' = :parameterName", { parameterName });
          qb.andWhere("params->>'parameterValue' = :parameterValue", { parameterValue });
        }),
      );
    }

    queryBuilder.leftJoinAndSelect("product.photos", "photos");

    // https://github.com/typeorm/typeorm/issues/2919
    // @ts-ignore
    queryBuilder.orderBy({
      [`product.${field}`]: sort.toUpperCase(),
    });

    return queryBuilder.getManyAndCount();
  }

  public async getNewProducts(): Promise<[Array<ProductEntity>, number]> {
    const queryBuilder = this.productEntityRepository.createQueryBuilder("product");

    queryBuilder.select();
    queryBuilder.where({ productStatus: ProductStatus.ACTIVE });
    queryBuilder.andWhere("photos.priority = 0");
    queryBuilder.leftJoinAndSelect(
      "product.photos",
      "photos",
      "photos.photoStatus = :photoStatus AND photos.priority = :priority",
      {
        photoStatus: PhotoStatus.APPROVED,
        priority: 0,
      },
    );
    queryBuilder.orderBy({
      "product.createdAt": "DESC",
    });

    queryBuilder.skip(0);
    queryBuilder.take(10);

    queryBuilder.groupBy("product.id, photos.id");
    queryBuilder.having("COUNT(photos.id) > 0");

    return queryBuilder.getManyAndCount();
  }

  public async getPopularProducts(): Promise<[Array<ProductEntity>, number]> {
    const queryBuilder = this.productEntityRepository.createQueryBuilder("product");

    queryBuilder.select();
    queryBuilder.where({ productStatus: ProductStatus.ACTIVE });

    queryBuilder.leftJoinAndSelect(
      subQuery =>
        subQuery
          // TODO total is not in the final json
          .select(`items.product_id, SUM(items.amount) AS total`)
          .from(OrderItemEntity, "items")
          .leftJoin("order", "order", `order.id = items.order_id AND order.order_status = :orderStatus`, {
            orderStatus: OrderStatus.CLOSED,
          })
          .groupBy("items.product_id"),
      "items",
      "items.product_id = product.id",
    );

    queryBuilder.andWhere("items.total IS NOT NULL");

    queryBuilder.leftJoinAndSelect(
      "product.photos",
      "photos",
      "photos.photoStatus = :photoStatus AND photos.priority = :priority",
      {
        photoStatus: PhotoStatus.APPROVED,
        priority: 0,
      },
    );

    queryBuilder.orderBy({
      total: "DESC",
    });

    // take fails
    queryBuilder.limit(10);

    queryBuilder.groupBy("product.id, photos.id, items.product_id, items.total");
    queryBuilder.having("COUNT(photos.id) > 0");

    return queryBuilder.getManyAndCount();
  }

  public findAndCount(
    where: FindOptionsWhere<ProductEntity>,
    options?: FindManyOptions<ProductEntity>,
  ): Promise<[Array<ProductEntity>, number]> {
    return this.productEntityRepository.findAndCount({ where, ...options });
  }

  public findOne(
    where: FindOptionsWhere<ProductEntity>,
    options?: FindOneOptions<ProductEntity>,
  ): Promise<ProductEntity | null> {
    return this.productEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<ProductEntity>): Promise<ProductEntity | null> {
    return this.findOne(where, {
      join: {
        alias: "product",
        leftJoinAndSelect: {
          price: "product.price",
          price_components: "price.components",
          price_contract: "price_components.contract",
          // categories: "product.categories",
          // photos: "product.photos",
        },
      },
      order: {
        photos: {
          priority: "ASC",
        },
      },
      relations: {
        categories: true,
        photos: true,
      },
    });
  }

  public findAll(
    where: FindOptionsWhere<ProductEntity>,
    options?: FindOneOptions<ProductEntity>,
  ): Promise<Array<ProductEntity>> {
    return this.productEntityRepository.find({ where, ...options });
  }
}
