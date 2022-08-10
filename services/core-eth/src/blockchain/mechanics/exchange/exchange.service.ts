import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ExchangeEntity } from "./exchange.entity";

@Injectable()
export class ExchangeService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(ExchangeEntity)
    private readonly recipeEntityRepository: Repository<ExchangeEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<ExchangeEntity>,
    options?: FindOneOptions<ExchangeEntity>,
  ): Promise<ExchangeEntity | null> {
    return this.recipeEntityRepository.findOne({ where, ...options });
  }
}
