import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { PhotoStatus } from "@framework/types";

import { IPhotoCreateDto, IPhotoUpdateDto } from "./interfaces";
import { PhotoEntity } from "./photo.entity";
import { ProductEntity } from "../product/product.entity";

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(PhotoEntity)
    private readonly photoEntityRepository: Repository<PhotoEntity>,
  ) {}

  public search(): Promise<[Array<PhotoEntity>, number]> {
    return this.findAndCount({ photoStatus: PhotoStatus.NEW });
  }

  public findAndCount(
    where: FindOptionsWhere<PhotoEntity>,
    options?: FindManyOptions<PhotoEntity>,
  ): Promise<[Array<PhotoEntity>, number]> {
    return this.photoEntityRepository.findAndCount({ where, ...options });
  }

  public findOne(
    where: FindOptionsWhere<PhotoEntity>,
    options?: FindOneOptions<PhotoEntity>,
  ): Promise<PhotoEntity | null> {
    return this.photoEntityRepository.findOne({ where, ...options });
  }

  public async create(data: IPhotoCreateDto, productEntity: ProductEntity): Promise<PhotoEntity> {
    return this.photoEntityRepository
      .create({
        ...data,
        photoStatus: PhotoStatus.NEW,
        product: productEntity,
      })
      .save();
  }

  public async update(where: FindOptionsWhere<PhotoEntity>, data: IPhotoUpdateDto): Promise<PhotoEntity> {
    const photoEntity = await this.photoEntityRepository.findOne({ where });

    if (!photoEntity) {
      throw new NotFoundException("photoNotFound");
    }

    Object.assign(photoEntity, { ...data });
    return photoEntity.save();
  }

  public count(where: FindOptionsWhere<PhotoEntity>): Promise<number> {
    return this.photoEntityRepository.count({ where });
  }

  public delete(where: FindOptionsWhere<PhotoEntity>): Promise<DeleteResult> {
    return this.photoEntityRepository.delete(where);
  }
}
