import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Brackets, FindConditions, FindManyOptions, Repository} from "typeorm";

import {PhotoStatus, ProductStatus} from "@trejgun/solo-types";
import {SortDirection} from "@trejgun/types-collection";

import {ProductEntity} from "./product.entity";
import {IProductSortDto} from "./interfaces";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productEntityRepository: Repository<ProductEntity>,
  ) {}

  public async search(search: IProductSortDto): Promise<[Array<ProductEntity>, number]> {
    const {query, sortBy = "id", sort = SortDirection.asc, merchantId, categoryIds} = search;

    const queryBuilder = this.productEntityRepository.createQueryBuilder("product");

    queryBuilder.select();

    queryBuilder.where({productStatus: ProductStatus.ACTIVE});

    if (merchantId) {
      queryBuilder.andWhere("product.merchantId = :merchantId", {merchantId});
    }

    if (categoryIds) {
      queryBuilder.leftJoinAndSelect("product.categories", "category");
      queryBuilder.andWhere("category.id IN(:...categoryIds)", {categoryIds});
    }

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(product.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("product.title ILIKE '%' || :title || '%'", {title: query});
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", {description: query});
        }),
      );
    }

    queryBuilder.leftJoinAndSelect("product.photos", "photos");

    // https://github.com/typeorm/typeorm/issues/2919
    // @ts-ignore
    queryBuilder.orderBy({[`product.${sortBy}`]: sort.toUpperCase()});

    return queryBuilder.getManyAndCount();
  }

  public async getNewProducts(): Promise<[Array<ProductEntity>, number]> {
    const queryBuilder = this.productEntityRepository.createQueryBuilder("product");

    queryBuilder.select();
    queryBuilder.where({productStatus: ProductStatus.ACTIVE});
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

  public findAndCount(
    where: FindConditions<ProductEntity>,
    options?: FindManyOptions<ProductEntity>,
  ): Promise<[Array<ProductEntity>, number]> {
    return this.productEntityRepository.findAndCount({where, ...options});
  }

  public findOne(where: FindConditions<ProductEntity>): Promise<ProductEntity | undefined> {
    const queryBuilder = this.productEntityRepository.createQueryBuilder("product");

    queryBuilder.where(where);

    queryBuilder.leftJoinAndSelect("product.categories", "categories");
    queryBuilder.leftJoinAndSelect("product.photos", "photos");

    // working around https://github.com/typeorm/typeorm/issues/2620
    queryBuilder.orderBy({
      "photos.priority": "ASC",
    });

    return queryBuilder.getOne();
  }
}
