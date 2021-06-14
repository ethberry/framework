import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Brackets, FindConditions, FindManyOptions, FindOneOptions, Repository} from "typeorm";

import {ProductStatus} from "@trejgun/solo-types";
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
    const {query, sortBy = "id", sort = SortDirection.asc, merchantId} = search;

    const queryBuilder = this.productEntityRepository.createQueryBuilder("product");

    queryBuilder.select();

    queryBuilder.where({productStatus: ProductStatus.ACTIVE});

    if (merchantId) {
      queryBuilder.andWhere("product.merchantId = :merchantId", {merchantId});
    }

    if (query) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("product.title ILIKE '%' || :title || '%'", {title: query});
          qb.orWhere("product.description ILIKE '%' || :description || '%'", {description: query});
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
    queryBuilder.leftJoinAndSelect("product.photos", "photo");
    queryBuilder.orderBy("product.createdAt", "DESC");
    queryBuilder.limit(3);

    return queryBuilder.getManyAndCount();
  }

  public findAndCount(
    where: FindConditions<ProductEntity>,
    options?: FindManyOptions<ProductEntity>,
  ): Promise<[Array<ProductEntity>, number]> {
    return this.productEntityRepository.findAndCount({where, ...options});
  }

  public findOne(
    where: FindConditions<ProductEntity>,
    options?: FindOneOptions<ProductEntity>,
  ): Promise<ProductEntity | undefined> {
    return this.productEntityRepository.findOne({where, ...options});
  }
}
