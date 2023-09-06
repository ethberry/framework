import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ProductItemParameterEntity } from "./product-item-parameter.entity";
import { ProductItemParameterCreateDto, ProductItemParameterUpdateDto } from "./dto";

@Injectable()
export class ProductItemParameterService {
  constructor(
    @InjectRepository(ProductItemParameterEntity)
    private readonly productItemParameterRepository: Repository<ProductItemParameterEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<ProductItemParameterEntity>,
    options?: FindOneOptions<ProductItemParameterEntity>,
  ): Promise<ProductItemParameterEntity | null> {
    return this.productItemParameterRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<ProductItemParameterEntity>,
    options?: FindManyOptions<ProductItemParameterEntity>,
  ): Promise<Array<ProductItemParameterEntity> | null> {
    return this.productItemParameterRepository.find({ where, ...options });
  }

  public create(dto: ProductItemParameterCreateDto): Promise<ProductItemParameterEntity> {
    return this.productItemParameterRepository.create({ ...dto }).save();
  }

  public async update(
    where: FindOptionsWhere<ProductItemParameterEntity>,
    dto: ProductItemParameterUpdateDto,
  ): Promise<ProductItemParameterEntity> {
    const productItemParameterEntity = await this.productItemParameterRepository.findOne({ where });

    if (!productItemParameterEntity) {
      throw new NotFoundException("parameterItemParameterNotFound");
    }

    Object.assign(productItemParameterEntity, { ...dto });
    return productItemParameterEntity.save();
  }

  public delete(where: FindOptionsWhere<ProductItemParameterEntity>): Promise<DeleteResult> {
    return this.productItemParameterRepository.delete(where);
  }
}
