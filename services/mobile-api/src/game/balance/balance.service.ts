import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { map } from "rxjs";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { BalanceEntity } from "./balance.entity";

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(BalanceEntity)
    private readonly merchantEntityRepository: Repository<BalanceEntity>,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  public findOne(
    where: FindOptionsWhere<BalanceEntity>,
    options?: FindOneOptions<BalanceEntity>,
  ): Promise<BalanceEntity | null> {
    return this.merchantEntityRepository.findOne({ where, ...options });
  }

  public async redeemBalance(userEntity: UserEntity): Promise<void> {
    const balanceEntity = await this.findOne({ userId: userEntity.id });
    if (!balanceEntity) {
      throw new NotFoundException("balanceNotFound");
    }

    const gameMicroserviceAddress = this.configService.get<string>(
      "GAME_MICROSERVICE_ADDRESS",
      "http://localhost:3012",
    );

    const merchantApiKey = this.configService.get<string>("MERCHANT_API_KEY", "11111111-2222-3333-4444-555555555555");

    const claim = await this.httpService
      .post<Record<string, any>>(
        `${gameMicroserviceAddress}/claims`,
        {
          account: userEntity.wallet,
          item: {
            components: [
              {
                tokenType: "ERC20",
                contractId: 1201,
                templateId: 120101,
                amount: 1000,
              },
            ],
          },
          endTimestamp: "2025-01-01T00:00:00.000Z",
        },
        {
          headers: {
            Authorization: `Bearer ${merchantApiKey}`,
          },
        },
      )
      .pipe(map(({ data }) => data))
      .toPromise();

    this.loggerService.log(JSON.stringify(claim, null, "\t"), BalanceService.name);

    // TODO save claim receipt
  }
}
