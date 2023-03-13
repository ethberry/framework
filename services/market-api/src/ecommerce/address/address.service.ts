import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOptionsWhere, Repository } from "typeorm";

import { AddressStatus } from "@framework/types";

import { AddressEntity } from "./address.entity";
import { IAddressCreateDto, IAddressUpdateDto } from "./interfaces";
import { UserEntity } from "../../infrastructure/user/user.entity";

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressEntityRepository: Repository<AddressEntity>,
  ) {}

  public search(userEntity: UserEntity): Promise<[Array<AddressEntity>, number]> {
    return this.addressEntityRepository.findAndCount({
      where: {
        userId: userEntity.id,
        addressStatus: AddressStatus.ACTIVE,
      },
    });
  }

  public findAndCount(
    where: FindOptionsWhere<AddressEntity>,
    options?: FindManyOptions<AddressEntity>,
  ): Promise<[Array<AddressEntity>, number]> {
    return this.addressEntityRepository.findAndCount({ where, ...options });
  }

  public findOne(where: FindOptionsWhere<AddressEntity>): Promise<AddressEntity | null> {
    return this.addressEntityRepository.findOne({ where });
  }

  public async create(data: IAddressCreateDto, userEntity: UserEntity): Promise<AddressEntity> {
    const { isDefault, ...rest } = data;

    const count = await this.addressEntityRepository.count({
      where: {
        userId: userEntity.id,
        addressStatus: AddressStatus.ACTIVE,
      },
    });

    if (isDefault) {
      await this.addressEntityRepository.update({ userId: userEntity.id }, { isDefault: false });
    }

    return this.addressEntityRepository
      .create({
        ...rest,
        user: userEntity,
        addressStatus: AddressStatus.ACTIVE,
        isDefault: !count ? true : isDefault,
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

  public async delete(where: FindOptionsWhere<AddressEntity>): Promise<AddressEntity | null> {
    const addressEntity = await this.addressEntityRepository.findOne({ where });

    if (!addressEntity) {
      throw new NotFoundException("addressNotFound");
    }

    const { isDefault } = addressEntity;

    Object.assign(addressEntity, {
      isDefault: false,
      addressStatus: AddressStatus.INACTIVE,
    });
    await addressEntity.save();

    if (isDefault) {
      // Postgres does not support update with limit
      const newDefaultAddressEntity = await this.addressEntityRepository.findOne({
        where: {
          userId: where.userId,
          isDefault: false,
          addressStatus: AddressStatus.ACTIVE,
        },
        order: {
          createdAt: "DESC",
        },
      });

      if (newDefaultAddressEntity) {
        Object.assign(newDefaultAddressEntity, {
          isDefault: true,
        });
        await newDefaultAddressEntity.save();
      }
    }

    return addressEntity;
  }
}
