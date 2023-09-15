import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { PhotoStatus, ProductStatus } from "@framework/types";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { PhotoService } from "../photo/photo.service";
import { PhotoEntity } from "../photo/photo.entity";
import type { IProductCreateDto, IProductSearchDto, IProductUpdateDto } from "./interfaces";
import { ProductEntity } from "./product.entity";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productEntityRepository: Repository<ProductEntity>,
    private readonly photoService: PhotoService,
  ) {}

  public async search(
    dto: Partial<IProductSearchDto>,
    userEntity: UserEntity,
  ): Promise<[Array<ProductEntity>, number]> {
    const { query, productStatus, categoryIds, skip, take } = dto;

    const queryBuilder = this.productEntityRepository.createQueryBuilder("product");

    queryBuilder.select();

    queryBuilder.andWhere("product.merchantId = :merchantId", {
      merchantId: userEntity.merchantId,
    });

    if (categoryIds) {
      queryBuilder.leftJoinAndSelect("product.categories", "category");
      queryBuilder.andWhere("category.id IN(:...categoryIds)", { categoryIds });
    }

    if (productStatus) {
      if (productStatus.length === 1) {
        queryBuilder.andWhere("product.productStatus = :productStatus", { productStatus: productStatus[0] });
      } else {
        queryBuilder.andWhere("product.productStatus IN(:...productStatus)", { productStatus });
      }
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

    queryBuilder.leftJoinAndSelect("product.categories", "categories");
    queryBuilder.leftJoinAndSelect("product.photos", "photos");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "product.createdAt": "DESC",
      "photos.priority": "DESC",
    });

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
          productItems: "product.productItems",
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
    options?: FindManyOptions<ProductEntity>,
  ): Promise<Array<ProductEntity>> {
    return this.productEntityRepository.find({ where, ...options });
  }

  public async create(dto: IProductCreateDto, userEntity: UserEntity): Promise<ProductEntity> {
    const { categoryIds, photos, parameters: _parameters, productItems: _productItems, ...rest } = dto;

    const productEntity = await this.productEntityRepository
      .create({
        ...rest,
        merchantId: userEntity.merchantId,
        productStatus: ProductStatus.ACTIVE,
        categories: categoryIds.map(id => ({ id })),
      })
      .save();

    // add new
    await Promise.allSettled(
      photos.map((newPhoto, i) => this.photoService.create({ ...newPhoto, priority: i }, productEntity)),
    ).then((values: Array<PromiseSettledResult<PhotoEntity>>) =>
      values
        .filter(c => c.status === "fulfilled")
        .map(c => <PromiseFulfilledResult<PhotoEntity>>c)
        .map(c => c.value),
    );

    return productEntity;
  }

  public async update(
    where: FindOptionsWhere<ProductEntity>,
    dto: IProductUpdateDto,
    userEntity: UserEntity,
  ): Promise<ProductEntity> {
    const { photos, categoryIds, parameters: _parameters, productItems: _productItems, ...rest } = dto;

    where.merchantId = userEntity.merchantId;

    const productEntity = await this.productEntityRepository.findOne({
      where,
      relations: { photos: true },
    });

    if (!productEntity) {
      throw new NotFoundException("productNotFound");
    }

    if (photos.length) {
      // remove old
      await Promise.allSettled(
        productEntity.photos
          .filter(oldPhoto => !photos.find(newPhoto => newPhoto.imageUrl === oldPhoto.imageUrl))
          .map(oldPhoto => oldPhoto.remove()),
      );

      // change existing
      const changedPhotos = await Promise.allSettled(
        productEntity.photos
          .filter(oldPhoto => photos.find(newPhoto => newPhoto.imageUrl === oldPhoto.imageUrl))
          .map(oldPhoto => {
            const newPhoto = photos.find(newPhoto => newPhoto.imageUrl === oldPhoto.imageUrl);
            const index = photos.findIndex(newPhoto => newPhoto.imageUrl === oldPhoto.imageUrl);
            Object.assign(oldPhoto, {
              ...newPhoto,
              priority: index,
              photoStatus: PhotoStatus.NEW,
            });
            return oldPhoto.save();
          }),
      ).then((values: Array<PromiseSettledResult<PhotoEntity>>) =>
        values
          .filter(c => c.status === "fulfilled")
          .map(c => <PromiseFulfilledResult<PhotoEntity>>c)
          .map(c => c.value),
      );

      // add new
      const newPhotos = await Promise.allSettled(
        photos
          .filter(newPhoto => !productEntity.photos.find(oldPhoto => newPhoto.imageUrl === oldPhoto.imageUrl))
          .map(newPhoto => {
            const index = photos.indexOf(newPhoto);
            return this.photoService.create({ ...newPhoto, priority: index }, productEntity);
          }),
      ).then((values: Array<PromiseSettledResult<PhotoEntity>>) =>
        values
          .filter(c => c.status === "fulfilled")
          .map(c => <PromiseFulfilledResult<PhotoEntity>>c)
          .map(c => c.value),
      );

      Object.assign(productEntity, {
        photos: [...changedPhotos, ...newPhotos],
      });
    }

    Object.assign(productEntity, {
      ...rest,
      merchantId: userEntity.merchantId,
      categories: categoryIds.map(id => ({ id })),
    });

    return productEntity.save();
  }

  public async autocomplete(userEntity: UserEntity): Promise<Array<ProductEntity>> {
    const queryBuilder = this.productEntityRepository.createQueryBuilder("product");

    queryBuilder.select(["product.id", "product.title"]);

    queryBuilder.where("product.productStatus = :productStatus", { productStatus: ProductStatus.ACTIVE });

    queryBuilder.andWhere("product.merchantId = :merchantId", {
      merchantId: userEntity.merchantId,
    });

    return queryBuilder.getMany();
  }

  public async getOrdersCount(productEntity: ProductEntity): Promise<number> {
    const queryBuilder = this.productEntityRepository.createQueryBuilder("product");

    queryBuilder.andWhere("product.id = :productId", {
      productId: productEntity.id,
    });

    queryBuilder.leftJoin("product.productItems", "productItems");
    queryBuilder.leftJoin("productItems.orderItems", "orderItems");

    return queryBuilder.getCount();
  }

  public async delete(where: FindOptionsWhere<ProductEntity>, userEntity: UserEntity): Promise<ProductEntity> {
    const productEntity = await this.findOne(where);

    if (!productEntity) {
      throw new NotFoundException("productNotFound");
    }

    if (productEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const count = await this.getOrdersCount(productEntity);

    if (count) {
      Object.assign(productEntity, { productStatus: ProductStatus.INACTIVE });
      return productEntity.save();
    } else {
      return productEntity.remove();
    }
  }
}
