import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { BalanceEntity } from "./balance.entity";
import { IBalance, ModuleType } from "@framework/types";

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(BalanceEntity)
    private readonly balanceEntityRepository: Repository<BalanceEntity>,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
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

  public async update(where: FindOptionsWhere<BalanceEntity>, dto: Partial<IBalance>): Promise<BalanceEntity> {
    const balanceEntity = await this.findOne(where);

    if (!balanceEntity) {
      throw new NotFoundException("balanceNotFound");
    }

    Object.assign(balanceEntity, dto);

    return balanceEntity.save();
  }

  public delete(where: FindOptionsWhere<BalanceEntity>): Promise<DeleteResult> {
    return this.balanceEntityRepository.delete(where);
  }

  public searchByAddress(address: string): Promise<Array<BalanceEntity>> {
    return this.balanceEntityRepository.find({
      where: {
        account: address,
        token: {
          template: {
            contract: {
              contractModule: ModuleType.HIERARCHY,
            },
          },
        },
      },
      join: {
        alias: "balance",
        leftJoinAndSelect: {
          token: "balance.token",
          template: "token.template",
          contract: "template.contract",
        },
      },
    });
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

    this.loggerService.log(JSON.stringify(balanceEntity, null, "\t"), BalanceService.name);

    balanceEntity.amount = (BigInt(balanceEntity.amount) + BigInt(amount)).toString();

    return balanceEntity.save();
  }

  public async decrement(tokenId: number, account: string, amount: string): Promise<BalanceEntity> {
    const balanceEntity = await this.findOne({ tokenId, account });

    if (!balanceEntity) {
      throw new NotFoundException("balanceNotFound");
    } else {
      balanceEntity.amount =
        BigInt(balanceEntity.amount) - BigInt(amount) > 0
          ? (BigInt(balanceEntity.amount) - BigInt(amount)).toString()
          : "0";
      return balanceEntity.save();
    }
  }
}
