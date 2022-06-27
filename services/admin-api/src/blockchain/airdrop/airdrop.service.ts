import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { Wallet } from "ethers";

import { AirdropStatus, IAirdropSearchDto } from "@framework/types";
import { prepareEip712 } from "@gemunion/butils";
import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";

import { IAirdropCreateDto, IAirdropItem } from "./interfaces";
import { AirdropEntity } from "./airdrop.entity";

@Injectable()
export class AirdropService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    @InjectRepository(AirdropEntity)
    private readonly airdropEntityRepository: Repository<AirdropEntity>,
  ) {}

  public async search(dto: Partial<IAirdropSearchDto>): Promise<[Array<AirdropEntity>, number]> {
    const { skip, take, account } = dto;

    const queryBuilder = this.airdropEntityRepository.createQueryBuilder("airdrop");

    queryBuilder.select();

    if (account) {
      queryBuilder.andWhere("airdrop.account ILIKE '%' || :account || '%'", { account });
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "airdrop.id": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<AirdropEntity>,
    options?: FindOneOptions<AirdropEntity>,
  ): Promise<AirdropEntity | null> {
    return this.airdropEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IAirdropCreateDto): Promise<Array<AirdropEntity | null>> {
    const { list } = dto;

    const results = await Promise.allSettled(
      list.map(async ({ account, item }) => {
        let signature = "0x";
        const airdropEntity = await this.airdropEntityRepository.create({ account, item, signature }).save();
        signature = await this.getSign({
          account,
          item,
          airdropId: airdropEntity.id,
        });
        Object.assign(airdropEntity, { signature });
        return airdropEntity.save();
      }),
    );

    return results.map(results => {
      if (results.status === "fulfilled") {
        return results.value;
      } else {
        this.loggerService.error(results.reason);
        return null;
      }
    });
  }

  public async delete(where: FindOptionsWhere<AirdropEntity>): Promise<DeleteResult> {
    return this.airdropEntityRepository.delete(where);
  }

  public async update(where: FindOptionsWhere<AirdropEntity>, dto: Partial<IAirdropItem>): Promise<AirdropEntity> {
    const airdropEntity = await this.findOne(where);

    if (!airdropEntity) {
      throw new NotFoundException("airdropNotFound");
    }

    // Update only NEW Airdrops
    if (airdropEntity.airdropStatus !== AirdropStatus.NEW) {
      throw new NotFoundException("airdropRedeemed");
    }

    const signature = await this.getSign({
      account: dto.account,
      asset: dto.item,
      airdropId: airdropEntity.id,
    });
    Object.assign(airdropEntity, { ...dto, signature });

    return airdropEntity.save();
  }

  public async getSign(data: Record<string, any>): Promise<string> {
    return this.signer._signTypedData(
      {
        name: "Airdrop",
        version: "1.0.0",
        chainId: ~~this.configService.get<string>("CHAIN_ID", "1337"),
        verifyingContract: this.configService.get<string>("AIRDROP_ADDR", ""),
      },
      prepareEip712(data), // TODO fix asset
      data,
    );
  }
}
