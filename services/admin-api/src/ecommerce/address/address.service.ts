import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOptionsWhere, Not, Repository, UpdateResult } from "typeorm";

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
    return this.addressEntityRepository.find({ where: { userId: dto.userId, addressStatus: AddressStatus.ACTIVE } });
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

  public async create(dto: IAddressCreateDto): Promise<AddressEntity> {
    const count = await this.addressEntityRepository.count({
      where: { userId: dto.userId, isDefault: true, addressStatus: AddressStatus.ACTIVE },
    });

    if (dto.isDefault) {
      await this.addressEntityRepository.update({ userId: dto.userId }, { isDefault: false });
    }

    return this.addressEntityRepository
      .create({
        ...dto,
        addressStatus: AddressStatus.ACTIVE,
        isDefault: !count ? true : dto.isDefault,
      })
      .save();
  }

  public async update(
    where: FindOptionsWhere<AddressEntity>,
    dto: IAddressUpdateDto,
  ): Promise<AddressEntity | undefined> {
    const addressEntity = await this.addressEntityRepository.findOne({ where });

    if (!addressEntity) {
      throw new NotFoundException("addressNotFound");
    }

    if (dto.isDefault) {
      await this.addressEntityRepository.update({ userId: dto.userId }, { isDefault: false });
    }

    Object.assign(addressEntity, dto);

    return addressEntity.save();
  }

  public async delete(where: FindOptionsWhere<AddressEntity>): Promise<UpdateResult | void> {
    const deletingAddress = await this.addressEntityRepository.findOne({ where });

    if (deletingAddress?.isDefault) {
      const address = await this.addressEntityRepository.findOne({
        where: { id: Not(deletingAddress.id), userId: deletingAddress.userId, addressStatus: AddressStatus.ACTIVE },
        order: { id: "DESC" },
      });
      await this.addressEntityRepository.update({ id: address?.id }, { isDefault: true });
    }

    return this.addressEntityRepository.update(where, { addressStatus: AddressStatus.INACTIVE, isDefault: false });
  }
}
