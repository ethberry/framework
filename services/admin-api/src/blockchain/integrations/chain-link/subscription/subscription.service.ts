import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { ChainLinkSubscriptionEntity } from "./subscription.entity";

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

  public async autocomplete(userEntity: UserEntity): Promise<Array<ChainLinkSubscriptionEntity>> {
    const { chainId, merchantId } = userEntity;

    return this.chainLinkSubscriptionEntityRepository.find({
      where: { chainId, merchantId },
      select: {
        id: true,
        vrfSubId: true,
      },
      order: { vrfSubId: "ASC" },
    });
  }

  public async create(dto: DeepPartial<ChainLinkSubscriptionEntity>): Promise<ChainLinkSubscriptionEntity> {
    return this.chainLinkSubscriptionEntityRepository.create(dto).save();
  }
}
