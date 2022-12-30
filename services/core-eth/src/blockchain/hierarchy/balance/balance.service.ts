import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { BigNumber } from "ethers";

import { BalanceEntity } from "./balance.entity";

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(BalanceEntity)
    private readonly balanceEntityRepository: Repository<BalanceEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<BalanceEntity>,
    options?: FindOneOptions<BalanceEntity>,
  ): Promise<BalanceEntity | null> {
    return this.balanceEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<BalanceEntity>): Promise<BalanceEntity> {
    return this.balanceEntityRepository.create(dto).save();
  }

  public async createBatch(dto: Array<DeepPartial<BalanceEntity>>): Promise<Array<BalanceEntity>> {
    return this.balanceEntityRepository.save(dto, { chunk: 1000 });
  }

  public async increment(tokenId: number, account: string, amount: string): Promise<BalanceEntity> {
    const balanceEntity = await this.findOne({ tokenId, account });

    if (!balanceEntity) {
      return this.create({
        tokenId,
        account,
        amount,
      });
    }

    balanceEntity.amount = BigNumber.from(balanceEntity.amount).add(amount).toString();
    return balanceEntity.save();
  }

  public async decrement(tokenId: number, account: string, amount: string): Promise<BalanceEntity> {
    const balanceEntity = await this.findOne({ tokenId, account });

    if (!balanceEntity) {
      throw new NotFoundException("balanceNotFound");
    } else {
      balanceEntity.amount = BigNumber.from(balanceEntity.amount).sub(amount).toString();
      return balanceEntity.save();
    }
  }
}
