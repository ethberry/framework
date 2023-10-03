import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ChainLinkSubscriptionEntity } from "./subscription.entity";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import type { ISubscriptionAutocompleteDto } from "./dto";

@Injectable()
export class ChainLinkSubscriptionService {
  constructor(
    @InjectRepository(ChainLinkSubscriptionEntity)
    private readonly chainLinkSubscriptionEntityRepository: Repository<ChainLinkSubscriptionEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<ChainLinkSubscriptionEntity>,
    options?: FindOneOptions<ChainLinkSubscriptionEntity>,
  ): Promise<ChainLinkSubscriptionEntity | null> {
    return this.chainLinkSubscriptionEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<ChainLinkSubscriptionEntity>,
    options?: FindManyOptions<ChainLinkSubscriptionEntity>,
  ): Promise<Array<ChainLinkSubscriptionEntity>> {
    return this.chainLinkSubscriptionEntityRepository.find({ where, ...options });
  }

  //
  public async autocomplete(
    dto: Partial<ISubscriptionAutocompleteDto>,
    userEntity: UserEntity,
  ): Promise<Array<ChainLinkSubscriptionEntity>> {
    const { chainId, merchantId } = dto;

    if (userEntity.merchantId === Number(merchantId)) {
      const where = {
        chainId,
        merchantId,
      };

      return await this.chainLinkSubscriptionEntityRepository.find({
        where,
        select: {
          id: true,
          vrfSubId: true,
        },
        order: { vrfSubId: "ASC" },
      });
    } else {
      return [];
    }
  }

  public async create(dto: DeepPartial<ChainLinkSubscriptionEntity>): Promise<ChainLinkSubscriptionEntity> {
    return this.chainLinkSubscriptionEntityRepository.create(dto).save();
  }
}
