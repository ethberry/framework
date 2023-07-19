import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IWaitListItemCreateDto } from "@framework/types";

import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";
import { WaitListListService } from "../list/list.service";
import { WaitListItemEntity } from "./item.entity";

@Injectable()
export class WaitListItemService {
  constructor(
    @InjectRepository(WaitListItemEntity)
    private readonly waitListItemEntityRepository: Repository<WaitListItemEntity>,
    private readonly waitListListService: WaitListListService,
  ) {}

  public findOne(
    where: FindOptionsWhere<WaitListItemEntity>,
    options?: FindOneOptions<WaitListItemEntity>,
  ): Promise<WaitListItemEntity | null> {
    return this.waitListItemEntityRepository.findOne({ where, ...options });
  }

  public async createItem(dto: IWaitListItemCreateDto, merchantEntity: MerchantEntity): Promise<WaitListItemEntity> {
    const { listId } = dto;
    const waitListListEntity = await this.waitListListService.findOne(
      { id: listId },
      { relations: { contract: true } },
    );

    if (!waitListListEntity) {
      throw new NotFoundException("waitListListNotFound");
    }

    if (waitListListEntity.contract.merchantId !== merchantEntity.id) {
      throw new ForbiddenException("insufficientPermissions");
    }

    const waitListItemEntity = await this.findOne(dto);

    if (waitListItemEntity) {
      throw new ConflictException("duplicateAccount");
    }

    return this.create(dto);
  }

  public async create(dto: IWaitListItemCreateDto): Promise<WaitListItemEntity> {
    return this.waitListItemEntityRepository.create(dto).save();
  }

  public async delete(
    where: FindOptionsWhere<WaitListItemEntity>,
    merchantEntity: MerchantEntity,
  ): Promise<WaitListItemEntity> {
    const waitListItemEntity = await this.findOne(where, { relations: { list: { contract: true } } });

    if (!waitListItemEntity) {
      throw new NotFoundException("claimNotFound");
    }

    if (waitListItemEntity.list.contract.merchantId !== merchantEntity.id) {
      throw new ForbiddenException("insufficientPermissions");
    }

    return waitListItemEntity.remove();
  }
}
