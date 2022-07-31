import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IPaginationDto } from "@gemunion/types-collection";

import { DropEntity } from "./drop.entity";
import { IDropCreateDto, IDropUpdateDto } from "./interfaces";
import { AssetService } from "../asset/asset.service";

@Injectable()
export class DropService {
  constructor(
    @InjectRepository(DropEntity)
    private readonly gradeEntityRepository: Repository<DropEntity>,
    protected readonly assetService: AssetService,
  ) {}

  public async search(dto: IPaginationDto): Promise<[Array<DropEntity>, number]> {
    const { skip, take } = dto;

    const queryBuilder = this.gradeEntityRepository.createQueryBuilder("drop");

    queryBuilder.leftJoinAndSelect("drop.template", "template");

    queryBuilder.select();

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "drop.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<DropEntity>,
    options?: FindOneOptions<DropEntity>,
  ): Promise<DropEntity | null> {
    return this.gradeEntityRepository.findOne({ where, ...options });
  }

  public async update(where: FindOptionsWhere<DropEntity>, dto: Partial<IDropUpdateDto>): Promise<DropEntity> {
    const dropEntity = await this.findOne(where);

    if (!dropEntity) {
      throw new NotFoundException("dropNotFound");
    }

    Object.assign(dropEntity, dto);

    return dropEntity.save();
  }

  public create(dto: Partial<IDropCreateDto>): Promise<DropEntity> {
    return this.gradeEntityRepository.create(dto).save();
  }
}
