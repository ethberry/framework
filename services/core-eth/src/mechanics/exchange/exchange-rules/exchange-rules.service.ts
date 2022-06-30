import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ExchangeRulesEntity } from "./exchange-rules.entity";

@Injectable()
export class ExchangeRulesService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(ExchangeRulesEntity)
    private readonly recipeEntityRepository: Repository<ExchangeRulesEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<ExchangeRulesEntity>,
    options?: FindOneOptions<ExchangeRulesEntity>,
  ): Promise<ExchangeRulesEntity | null> {
    return this.recipeEntityRepository.findOne({ where, ...options });
  }
}
