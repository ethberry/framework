import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Brackets, FindConditions, FindManyOptions, FindOneOptions, Repository} from "typeorm";

import {PhotoStatus, ProductStatus, UserRole} from "@trejgun/solo-types";

import {ProductEntity} from "./product.entity";
import {IProductCreateDto, IProductSearchDto, IProductUpdateDto} from "./interfaces";
import {UserEntity} from "../user/user.entity";
import {PhotoService} from "../photo/photo.service";
import {PhotoEntity} from "../photo/photo.entity";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productEntityRepository: Repository<ProductEntity>,
    private readonly photoService: PhotoService,
  ) {}

  public async search(dto: IProductSearchDto, userEntity: UserEntity): Promise<[Array<ProductEntity>, number]> {
    const {query, productStatus, categoryIds, skip, take} = dto;

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
      queryBuilder.andWhere("category.id IN(:...categoryIds)", {categoryIds});
    }

    if (productStatus) {
      if (productStatus.length === 1) {
        queryBuilder.andWhere("product.productStatus = :productStatus", {productStatus: productStatus[0]});
      } else {
        queryBuilder.andWhere("product.productStatus IN(:...productStatus)", {productStatus});
      }
    }

    if (query) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("product.title ILIKE '%' || :title || '%'", {title: query});
          qb.orWhere("product.description ILIKE '%' || :description || '%'", {description: query});
        }),
      );
    }

    queryBuilder.leftJoinAndSelect("product.categories", "categories");
    queryBuilder.leftJoinAndSelect("product.photos", "photos");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy("product.createdAt", "DESC");

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

  public async create(dto: IProductCreateDto, userEntity: UserEntity): Promise<ProductEntity> {
    const {categoryIds, photos, ...rest} = dto;

    const merchantId = userEntity.userRoles.includes(UserRole.ADMIN) ? dto.merchantId : userEntity.merchant.id;

    const productEntity = await this.productEntityRepository
      .create({
        ...rest,
        merchantId,
        productStatus: ProductStatus.ACTIVE,
        categories: categoryIds.map(id => ({id})),
      })
      .save();

    // add new
    await Promise.allSettled(photos.map(newPhoto => this.photoService.create(newPhoto, productEntity))).then(
      (values: Array<PromiseSettledResult<PhotoEntity>>) =>
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
    const {photos, categoryIds, ...rest} = dto;

    if (!userEntity.userRoles.includes(UserRole.ADMIN)) {
      where.merchant = userEntity.merchant;
    }

    const productEntity = await this.productEntityRepository.findOne(where, {relations: ["photos"]});

    if (!productEntity) {
      throw new NotFoundException("productNotFound");
    }

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
          Object.assign(oldPhoto, {
            ...newPhoto,
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
        .map(newPhoto => this.photoService.create(newPhoto, productEntity)),
    ).then((values: Array<PromiseSettledResult<PhotoEntity>>) =>
      values
        .filter(c => c.status === "fulfilled")
        .map(c => <PromiseFulfilledResult<PhotoEntity>>c)
        .map(c => c.value),
    );

    Object.assign(productEntity, {
      ...rest,
      photos: [...changedPhotos, ...newPhotos],
      categories: categoryIds.map(id => ({id})),
    });
    return productEntity.save();
  }

  public async autocomplete(userEntity: UserEntity): Promise<Array<ProductEntity>> {
    const queryBuilder = this.productEntityRepository.createQueryBuilder("product");

    queryBuilder.select(["product.id", "product.title"]);

    queryBuilder.where("product.productStatus = :productStatus", {productStatus: ProductStatus.ACTIVE});

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
