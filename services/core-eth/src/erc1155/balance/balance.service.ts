import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { BigNumber } from "ethers";

import { Erc1155BalanceEntity } from "./balance.entity";

@Injectable()
export class Erc1155BalanceService {
  constructor(
    @InjectRepository(Erc1155BalanceEntity)
    private readonly erc1155BalanceEntityRepository: Repository<Erc1155BalanceEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<Erc1155BalanceEntity>,
    options?: FindOneOptions<Erc1155BalanceEntity>,
  ): Promise<Erc1155BalanceEntity | null> {
    return this.erc1155BalanceEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<Erc1155BalanceEntity>): Promise<Erc1155BalanceEntity> {
    return this.erc1155BalanceEntityRepository.create(dto).save();
  }

  public async increment(uniTokenId: number, account: string, amount: string): Promise<Erc1155BalanceEntity> {
    const balanceEntity = await this.findOne({ uniTokenId, account });

    if (!balanceEntity) {
      return this.create({
        uniTokenId,
        account,
        amount,
      });
    }

    balanceEntity.amount = BigNumber.from(balanceEntity.amount).add(amount).toString();
    return balanceEntity.save();
  }

  public async decrement(uniTokenId: number, account: string, amount: string): Promise<Erc1155BalanceEntity> {
    const balanceEntity = await this.findOne({ uniTokenId, account });

    if (!balanceEntity) {
      throw new NotFoundException("balanceNotFound");
    } else {
      balanceEntity.amount = BigNumber.from(balanceEntity.amount).add(amount).toString();
      return balanceEntity.save();
    }
  }
}
