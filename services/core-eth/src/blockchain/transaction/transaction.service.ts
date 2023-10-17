import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Brackets,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  In,
  Not,
  Any,
} from "typeorm";

import { TransactionEntity } from "./transaction.entity";
import { TransactionStatus } from "@framework/types";

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionEntityRepository: Repository<TransactionEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<TransactionEntity>,
    options?: FindOneOptions<TransactionEntity>,
  ): Promise<TransactionEntity | null> {
    return this.transactionEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: DeepPartial<TransactionEntity>): Promise<TransactionEntity> {
    return this.transactionEntityRepository.create(dto).save();
  }

  public async update(
    where: FindOptionsWhere<TransactionEntity>,
    dto: DeepPartial<TransactionEntity>,
  ): Promise<TransactionEntity> {
    const transactionEntity = await this.findOne(where);

    if (!transactionEntity) {
      throw new NotFoundException("transactionNotFound");
    }

    Object.assign(transactionEntity, dto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return transactionEntity.save();
  }

  public findAll(
    where: FindOptionsWhere<TransactionEntity>,
    options?: FindManyOptions<TransactionEntity>,
  ): Promise<Array<TransactionEntity>> {
    return this.transactionEntityRepository.find({ where, ...options });
  }

  public async findAllTxHashes(where: FindOptionsWhere<TransactionEntity>): Promise<Array<string> | null> {
    // return await this.findAll(where);

    const queryBuilder = this.transactionEntityRepository.createQueryBuilder("transactions");
    queryBuilder.select(["transactions.transactionHash"]);
    queryBuilder.where(where);

    queryBuilder.andWhere(
      new Brackets(qb => {
        qb.where("transactions.transactionStatus = :transactionStatusPending", {
          transactionStatusPending: TransactionStatus.PENDING,
        });
        qb.orWhere("transactions.transactionStatus = :transactionStatusProcess", {
          transactionStatusProcess: TransactionStatus.PROCESS,
        });
      }),
    );

    // queryBuilder.andWhere("transactions.transactionStatus = :transactionStatus", {
    //   transactionStatus: Not(TransactionStatus.PROCESSED),
    //   // transactionStatus: Not(`${TransactionStatus.PROCESSED}` as unknown as TransactionStatus),
    //   // transactionStatus: Any([TransactionStatus.PENDING, TransactionStatus.PROCESS]),
    // });
    queryBuilder.groupBy("transactions.id, transactions.transactionHash");

    const allTxs = await queryBuilder.getMany();
    if (allTxs) {
      return [...new Set(allTxs.map(tx => tx.transactionHash))];
    }
    return null;
  }

  public async updateTxsStatus(where: FindOptionsWhere<TransactionEntity>, status: TransactionStatus): Promise<void> {
    const txs = await this.findAll(where);
    // update status
    txs.map(async tx => {
      if (tx.transactionStatus === TransactionStatus.PENDING) {
        Object.assign(tx, { transactionStatus: status });
      }
      await tx.save();
    });
  }

  public async findAllLogsByHash(transactionHash: string, chainId: number): Promise<Array<TransactionEntity>> {
    const queryBuilder = this.transactionEntityRepository.createQueryBuilder("transactions");

    queryBuilder.select();

    queryBuilder.andWhere("transactions.transactionHash = :transactionHash", { transactionHash });
    queryBuilder.andWhere("transactions.chainId = :chainId", { chainId });

    queryBuilder.andWhere(
      new Brackets(qb => {
        qb.where("transactions.transactionStatus = :transactionStatusPending", {
          transactionStatusPending: TransactionStatus.PENDING,
        });
        qb.orWhere("transactions.transactionStatus = :transactionStatusProcess", {
          transactionStatusProcess: TransactionStatus.PROCESS,
        });
      }),
    );

    // queryBuilder.andWhere("transactions.transactionStatus = :transactionStatus", {
    //   transactionStatus: Not(TransactionStatus.PROCESSED),
    //   // transactionStatus: Not(`${TransactionStatus.PROCESSED}` as unknown as TransactionStatus),
    //   // transactionStatus: Any([TransactionStatus.PENDING, TransactionStatus.PROCESS]),
    // });

    queryBuilder.orderBy({
      "transactions.blockNumber": "ASC",
      "transactions.transactionIndex": "ASC",
      "transactions.logIndex": "ASC",
    });

    return await queryBuilder.getMany();
  }
}
