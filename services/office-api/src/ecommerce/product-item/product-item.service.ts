import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ProductStatus } from "@framework/types";

import { AssetService } from "../../blockchain/exchange/asset/asset.service";
import { UserEntity } from "../../infrastructure/user/user.entity";
import { PhotoService } from "../photo/photo.service";
import { PhotoEntity } from "../photo/photo.entity";
import { ProductItemEntity } from "./product-item.entity";
import type { IProductItemCreateDto, IProductItemSearchDto, IProductItemUpdateDto } from "./interfaces";

@Injectable()
export class ProductItemService {
  constructor(
    @InjectRepository(ProductItemEntity)
    private readonly productItemEntityRepository: Repository<ProductItemEntity>,
    private readonly photoService: PhotoService,
    private readonly assetService: AssetService,
  ) {}

  public async search(dto: IProductItemSearchDto): Promise<[Array<ProductItemEntity>, number]> {
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
    options?: FindOneOptions<ProductItemEntity>,
  ): Promise<Array<ProductItemEntity>> {
    return this.productItemEntityRepository.find({ where, ...options });
  }

  public async create(dto: IProductItemCreateDto, userEntity: UserEntity): Promise<ProductItemEntity> {
    const { photo, price, ...rest } = dto;

    const assetEntity = await this.assetService.create();
    const productItemEntity = await this.productItemEntityRepository
      .create({
        ...rest,
        price: assetEntity,
      })
      .save();

    await this.assetService.update(productItemEntity.price, price, userEntity);

    // add new
    await Promise.allSettled([this.photoService.create({ ...photo, priority: 0 }, null, productItemEntity)]).then(
      (values: Array<PromiseSettledResult<PhotoEntity>>) =>
        values
          .filter(c => c.status === "fulfilled")
          .map(c => <PromiseFulfilledResult<PhotoEntity>>c)
          .map(c => c.value),
    );

    return productItemEntity;
  }

  public async update(
    where: FindOptionsWhere<ProductItemEntity>,
    dto: IProductItemUpdateDto,
    userEntity: UserEntity,
  ): Promise<ProductItemEntity> {
    const { photo, price, ...rest } = dto;

    const productItemEntity = await this.productItemEntityRepository.findOne({
      where,
      join: {
        alias: "template",
        leftJoinAndSelect: {
          price: "template.price",
          components: "price.components",
        },
      },
      relations: { photo: true },
    });

    if (!productItemEntity) {
      throw new NotFoundException("productNotFound");
    }

    if (photo) {
      // remove old
      await productItemEntity.photo.remove();

      Object.assign(productItemEntity, {
        photo,
      });
    }

    Object.assign(productItemEntity, {
      ...rest,
    });

    if (price) {
      await this.assetService.update(productItemEntity.price, price, userEntity);
    }

    return productItemEntity.save();
  }

  public async autocomplete(userEntity: UserEntity): Promise<Array<ProductItemEntity>> {
    const queryBuilder = this.productItemEntityRepository.createQueryBuilder("productItem");

    queryBuilder.leftJoinAndSelect("productItem.product", "product");
    queryBuilder.leftJoinAndSelect("productItem.parameters", "parameters");
    queryBuilder.select(["productItem.id", "product.title", "parameters"]);

    queryBuilder.andWhere("product.merchantId = :merchantId", {
      merchantId: userEntity.merchantId,
    });

    return queryBuilder.getMany();
  }

  public async delete(where: FindOptionsWhere<ProductItemEntity>): Promise<ProductItemEntity> {
    const productItemEntity = await this.findOne(where);

    if (!productItemEntity) {
      throw new NotFoundException("productItemNotFound");
    }

    if (productItemEntity.orderItems) {
      Object.assign(productItemEntity, { productStatus: ProductStatus.INACTIVE });
      return productItemEntity.save();
    } else {
      return productItemEntity.remove();
    }
  }
}
