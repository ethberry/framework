import { ConflictException, Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { DeepPartial, FindConditions, FindOneOptions, In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { WatcherEntity } from "./watcher.entity";
import { WatcherServiceRedis } from "./watcher.service.redis";
import { ITransactionCreateDto, ITransactionSearchDto, TransactionStatus } from "./interfaces";

@Injectable()
export class WatcherService {
  constructor(
    @InjectRepository(WatcherEntity)
    private readonly transactionEntityRepository: Repository<WatcherEntity>,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly transactionServiceRedis: WatcherServiceRedis,
  ) {}

  public search(dto: ITransactionSearchDto): Promise<[Array<WatcherEntity>, number]> {
    const { transactionHash, fromBlock, toBlock, status, skip, take } = dto;

    const queryBuilder = this.transactionEntityRepository.createQueryBuilder("transaction");

    queryBuilder.select();

    if (toBlock) {
      if (fromBlock) {
        queryBuilder.andWhere("transaction.blockNumber BETWEEN :fromBlock AND :toBlock", { fromBlock, toBlock });
      } else {
        queryBuilder.andWhere("transaction.blockNumber = :fromBlock", { fromBlock });
      }
    }

    if (transactionHash && transactionHash.length) {
      if (transactionHash.length === 1) {
        queryBuilder.andWhere("transaction.transactionHash = :transactionHash", {
          transactionHash: transactionHash[0],
        });
      } else {
        queryBuilder.andWhere("transaction.transactionHash IN(:...transactionHash)", { transactionHash });
      }
    }

    if (status && status.length) {
      if (status.length === 1) {
        queryBuilder.andWhere("transaction.status = :status", { status: status[0] });
      } else {
        queryBuilder.andWhere("transaction.status IN(:...status)", { status });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public findAll(
    where: FindConditions<WatcherEntity>,
    options?: FindOneOptions<WatcherEntity>,
  ): Promise<Array<WatcherEntity>> {
    return this.transactionEntityRepository.find({ where, ...options });
  }

  public findOne(
    where: FindConditions<WatcherEntity>,
    options?: FindOneOptions<WatcherEntity>,
  ): Promise<WatcherEntity | undefined> {
    return this.transactionEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: ITransactionCreateDto): Promise<WatcherEntity> {
    let transactionEntity = await this.findOne({ transactionHash: dto.transactionHash });
    if (transactionEntity) {
      throw new ConflictException("duplicateTransactionHash");
    }

    transactionEntity = await this.transactionEntityRepository.create(dto).save();

    await this.transactionServiceRedis.addRecord(transactionEntity.transactionHash, transactionEntity.transactionHash);

    return transactionEntity;
  }

  public async update(where: FindConditions<WatcherEntity>, dto: DeepPartial<WatcherEntity>): Promise<WatcherEntity> {
    const transactionEntity = await this.findOne(where);

    if (!transactionEntity) {
      throw new NotFoundException("transactionNotFound");
    }

    Object.assign(transactionEntity, dto);
    return transactionEntity.save();
  }

  public async delete(where: FindConditions<WatcherEntity>): Promise<WatcherEntity> {
    const transactionEntity = await this.findOne(where);
    if (!transactionEntity) {
      throw new NotFoundException("transactionNotFound");
    }

    return transactionEntity.remove();
  }

  public async init(): Promise<Array<void>> {
    const transactionEntities = await this.findAll({
      status: In([TransactionStatus.NEW, TransactionStatus.MINED]),
    });
    this.loggerService.log(`Restored ${transactionEntities.length} transactions from DB`);
    return Promise.all(
      transactionEntities.map(transactionEntity =>
        this.transactionServiceRedis.addRecord(transactionEntity.transactionHash, transactionEntity.transactionHash),
      ),
    );
  }
}
