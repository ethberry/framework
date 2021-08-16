import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindConditions, FindManyOptions, Repository } from "typeorm";

import { PhotoStatus, ProductStatus, UserRole } from "@gemunion/framework-types";

import { ProductEntity } from "./product.entity";
import { IProductCreateDto, IProductSearchDto, IProductUpdateDto } from "./interfaces";
import { UserEntity } from "../user/user.entity";
import { PhotoService } from "../photo/photo.service";
import { PhotoEntity } from "../photo/photo.entity";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productEntityRepository: Repository<ProductEntity>,
    private readonly photoService: PhotoService,
  ) {}

  public async search(dto: IProductSearchDto, userEntity: UserEntity): Promise<[Array<ProductEntity>, number]> {
    const { query, productStatus, categoryIds, skip, take } = dto;

    const queryBuilder = this.productEntityRepository.createQueryBuilder("product");

    queryBuilder.select();

    if (!userEntity.userRoles.includes(UserRole.ADMIN)) {
      // MERCHANT
      queryBuilder.leftJoinAndSelect("product.merchant", "merchant");
      queryBuilder.andWhere("product.merchantId = :merchantId", {
        merchantId: userEntity.merchantId,
      });
    }

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
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(product.description->'blocks') blocks ON TRUE",
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
      "photos.priority": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findAndCount(
    where: FindConditions<ProductEntity>,
    options?: FindManyOptions<ProductEntity>,
  ): Promise<[Array<ProductEntity>, number]> {
    return this.productEntityRepository.findAndCount({ where, ...options });
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

  public async create(dto: IProductCreateDto, userEntity: UserEntity): Promise<ProductEntity> {
    const { categoryIds, photos, ...rest } = dto;

    const merchantId = userEntity.userRoles.includes(UserRole.ADMIN) ? dto.merchantId : userEntity.merchant.id;

    const productEntity = await this.productEntityRepository
      .create({
        ...rest,
        merchantId,
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
    where: FindConditions<ProductEntity>,
    dto: IProductUpdateDto,
    userEntity: UserEntity,
  ): Promise<ProductEntity> {
    const { photos, categoryIds, ...rest } = dto;

    if (!userEntity.userRoles.includes(UserRole.ADMIN)) {
      where.merchant = userEntity.merchant;
    }

    const productEntity = await this.productEntityRepository.findOne(where, { relations: ["photos"] });

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
      categories: categoryIds.map(id => ({ id })),
    });

    return productEntity.save();
  }

  public async autocomplete(userEntity: UserEntity): Promise<Array<ProductEntity>> {
    const queryBuilder = this.productEntityRepository.createQueryBuilder("product");

    queryBuilder.select(["product.id", "product.title"]);

    queryBuilder.where("product.productStatus = :productStatus", { productStatus: ProductStatus.ACTIVE });

    if (!userEntity.userRoles.includes(UserRole.ADMIN)) {
      queryBuilder.andWhere("product.merchantId = :merchantId", {
        merchantId: userEntity.merchantId,
      });
    }

    return queryBuilder.getMany();
  }

  public async delete(where: FindConditions<ProductEntity>, userEntity: UserEntity): Promise<ProductEntity> {
    const queryBuilder = this.productEntityRepository.createQueryBuilder("product");
    queryBuilder.select();
    queryBuilder.where(where);

    if (!userEntity.userRoles.includes(UserRole.ADMIN)) {
      queryBuilder.andWhere("product.merchantId = :merchantId", {
        merchantId: userEntity.merchantId,
      });
    }

    const productEntity = await queryBuilder.getOne();

    if (!productEntity) {
      throw new NotFoundException("productNotFound");
    }

    return productEntity.remove();
  }
}
