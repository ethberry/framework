import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { BigNumber } from "ethers";

import { BalanceEntity } from "../../blockchain/hierarchy/balance/balance.entity";

@Injectable()
export class Erc1155BalanceService {
  constructor(
    @InjectRepository(BalanceEntity)
    private readonly erc1155BalanceEntityRepository: Repository<BalanceEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<BalanceEntity>,
    options?: FindOneOptions<BalanceEntity>,
  ): Promise<BalanceEntity | null> {
    return this.erc1155BalanceEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<BalanceEntity>): Promise<BalanceEntity> {
    return this.erc1155BalanceEntityRepository.create(dto).save();
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
      balanceEntity.amount = BigNumber.from(balanceEntity.amount).add(amount).toString();
      return balanceEntity.save();
    }
  }
}
