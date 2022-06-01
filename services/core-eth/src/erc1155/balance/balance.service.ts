import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

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

  public async increment(erc1155TokenId: number, wallet: string, amount: number): Promise<Erc1155BalanceEntity> {
    const balanceEntity = await this.findOne({ erc1155TokenId, wallet });

    if (!balanceEntity) {
      return this.create({
        erc1155TokenId,
        wallet,
        amount,
      });
    }

    balanceEntity.amount = balanceEntity.amount.add(amount);
    return balanceEntity.save();
  }

  public async decrement(erc1155TokenId: number, wallet: string, amount: number): Promise<Erc1155BalanceEntity> {
    const balanceEntity = await this.findOne({ erc1155TokenId, wallet });

    if (!balanceEntity) {
      throw new NotFoundException("balanceNotFound");
    } else {
      balanceEntity.amount = balanceEntity.amount.sub(amount);
      return balanceEntity.save();
    }
  }
}
