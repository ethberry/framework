import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Not, Repository, UpdateResult } from "typeorm";

import { AddressStatus } from "@framework/types";

import { AddressEntity } from "./address.entity";
import { IAddressAutocompleteDto, IAddressCreateDto, IAddressUpdateDto } from "./interfaces";

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressEntityRepository: Repository<AddressEntity>,
  ) {}

  public autocomplete(dto: IAddressAutocompleteDto): Promise<Array<AddressEntity>> {
    const { userId } = dto;

    return this.addressEntityRepository.find({ where: { userId, addressStatus: AddressStatus.ACTIVE } });
  }

  public findAndCount(
    where: FindOptionsWhere<AddressEntity>,
    options?: FindManyOptions<AddressEntity>,
  ): Promise<[Array<AddressEntity>, number]> {
    return this.addressEntityRepository.findAndCount({ where, ...options });
  }

  public findOne(
    where: FindOptionsWhere<AddressEntity>,
    options?: FindOneOptions<AddressEntity>,
  ): Promise<AddressEntity | null> {
    return this.addressEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IAddressCreateDto): Promise<AddressEntity> {
    const { isDefault, userId } = dto;
    const count = await this.addressEntityRepository.count({
      where: { userId, isDefault: true, addressStatus: AddressStatus.ACTIVE },
    });

    if (isDefault) {
      await this.addressEntityRepository.update({ userId }, { isDefault: false });
    }

    return this.addressEntityRepository
      .create({
        ...dto,
        addressStatus: AddressStatus.ACTIVE,
        isDefault: !count ? true : isDefault,
      })
      .save();
  }

  public async update(
    where: FindOptionsWhere<AddressEntity>,
    dto: IAddressUpdateDto,
  ): Promise<AddressEntity | undefined> {
    const { isDefault, userId } = dto;
    const addressEntity = await this.addressEntityRepository.findOne({ where });

    if (!addressEntity) {
      throw new NotFoundException("addressNotFound");
    }

    if (isDefault) {
      await this.addressEntityRepository.update({ userId }, { isDefault: false });
    }

    Object.assign(addressEntity, dto);

    return addressEntity.save();
  }

  public async delete(where: FindOptionsWhere<AddressEntity>): Promise<UpdateResult | void> {
    const addressEntity = await this.addressEntityRepository.findOne({ where });

    if (addressEntity?.isDefault) {
      const { id, userId } = addressEntity;
      const newDefaultAddressEntity = await this.addressEntityRepository.findOne({
        where: { id: Not(id), userId, addressStatus: AddressStatus.ACTIVE },
        order: { id: "DESC" },
      });
      await this.addressEntityRepository.update({ id: newDefaultAddressEntity?.id }, { isDefault: true });
    }

    return this.addressEntityRepository.update(where, { addressStatus: AddressStatus.INACTIVE, isDefault: false });
  }
}
