import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOptionsWhere, Repository, UpdateResult } from "typeorm";

import { AddressStatus } from "@framework/types";

import { AddressEntity } from "./address.entity";
import { IAddressCreateDto, IAddressUpdateDto } from "./interfaces";

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressEntityRepository: Repository<AddressEntity>,
  ) {}

  public findAndCount(
    where: FindOptionsWhere<AddressEntity>,
    options?: FindManyOptions<AddressEntity>,
  ): Promise<[Array<AddressEntity>, number]> {
    return this.addressEntityRepository.findAndCount({ where, ...options });
  }

  public findOne(where: FindOptionsWhere<AddressEntity>): Promise<AddressEntity | null> {
    return this.addressEntityRepository.findOne({ where });
  }

  public async create(data: IAddressCreateDto): Promise<AddressEntity> {
    const count = await this.addressEntityRepository.count({ where: { userId: data.userId } });

    return this.addressEntityRepository
      .create({
        ...data,
        addressStatus: AddressStatus.ACTIVE,
        isDefault: !count ? true : data.isDefault,
      })
      .save();
  }

  public async update(
    where: FindOptionsWhere<AddressEntity>,
    data: IAddressUpdateDto,
  ): Promise<AddressEntity | undefined> {
    const addressEntity = await this.addressEntityRepository.findOne({ where });

    if (!addressEntity) {
      throw new NotFoundException("addressNotFound");
    }

    if (data.isDefault) {
      await this.addressEntityRepository.update({ userId: where.userId }, { isDefault: false });
    }

    Object.assign(addressEntity, data);

    return addressEntity.save();
  }

  public delete(where: FindOptionsWhere<AddressEntity>): Promise<UpdateResult> {
    return this.addressEntityRepository.update(where, { addressStatus: AddressStatus.INACTIVE });
  }
}
