import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, FindConditions, FindManyOptions, Repository} from "typeorm";

import {PhotoStatus} from "@gemunionstudio/framework-types";

import {IPhotoCreateDto, IPhotoUpdateDto} from "./interfaces";
import {PhotoEntity} from "./photo.entity";
import {ProductEntity} from "../product/product.entity";

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(PhotoEntity)
    private readonly photoEntityRepository: Repository<PhotoEntity>,
  ) {}

  public search(): Promise<[Array<PhotoEntity>, number]> {
    return this.findAndCount({photoStatus: PhotoStatus.NEW});
  }

  public findAndCount(
    where: FindConditions<PhotoEntity>,
    options?: FindManyOptions<PhotoEntity>,
  ): Promise<[Array<PhotoEntity>, number]> {
    return this.photoEntityRepository.findAndCount({where, ...options});
  }

  public findOne(where: FindConditions<PhotoEntity>): Promise<PhotoEntity | undefined> {
    return this.photoEntityRepository.findOne({where});
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

  public async update(where: FindConditions<PhotoEntity>, data: IPhotoUpdateDto): Promise<PhotoEntity> {
    const photoEntity = await this.photoEntityRepository.findOne(where);

    if (!photoEntity) {
      throw new NotFoundException("photoNotFound");
    }

    Object.assign(photoEntity, {...data});
    return photoEntity.save();
  }

  public count(where: FindConditions<PhotoEntity>): Promise<number> {
    return this.photoEntityRepository.count(where);
  }

  public delete(where: FindConditions<PhotoEntity>): Promise<DeleteResult> {
    return this.photoEntityRepository.delete(where);
  }
}
