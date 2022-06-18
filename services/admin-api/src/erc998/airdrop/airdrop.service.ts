import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { Wallet } from "ethers";

import { Erc998AirdropStatus, IErc998AirdropSearchDto } from "@framework/types";
import { prepareEip712 } from "@gemunion/butils";
import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";

import { IErc998AirdropCreateDto, IErc998AirdropItem } from "./interfaces";
import { Erc998AirdropEntity } from "./airdrop.entity";

@Injectable()
export class Erc998AirderopService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    @InjectRepository(Erc998AirdropEntity)
    private readonly erc998AirdropEntityRepository: Repository<Erc998AirdropEntity>,
  ) {}

  public async search(dto: Partial<IErc998AirdropSearchDto>): Promise<[Array<Erc998AirdropEntity>, number]> {
    const { skip, take, query, erc998TemplateIds } = dto;

    const queryBuilder = this.erc998AirdropEntityRepository.createQueryBuilder("airdrop");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("airdrop.erc998Template", "template");

    if (query) {
      queryBuilder.andWhere("airdrop.owner ILIKE '%' || :owner || '%'", { owner: query });
    }

    if (erc998TemplateIds) {
      if (erc998TemplateIds.length === 1) {
        queryBuilder.andWhere("airdrop.erc998TemplateId = :erc998TemplateId", {
          erc998TemplateId: erc998TemplateIds[0],
        });
      } else {
        queryBuilder.andWhere("airdrop.erc998TemplateId IN(:...erc998TemplateIds)", { erc998TemplateIds });
      }
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "airdrop.id": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<Erc998AirdropEntity>,
    options?: FindOneOptions<Erc998AirdropEntity>,
  ): Promise<Erc998AirdropEntity | null> {
    return this.erc998AirdropEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IErc998AirdropCreateDto): Promise<Array<Erc998AirdropEntity | null>> {
    const { list } = dto;

    const results = await Promise.allSettled(
      list.map(async ({ owner, erc998TemplateId }) => {
        let signature = "0x";
        const airdropEntity = await this.erc998AirdropEntityRepository
          .create({ owner, erc998TemplateId, signature })
          .save();
        signature = await this.getSign({
          owner,
          airdropId: airdropEntity.id,
          templateId: erc998TemplateId,
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

  public async delete(where: FindOptionsWhere<Erc998AirdropEntity>): Promise<DeleteResult> {
    return this.erc998AirdropEntityRepository.delete(where);
  }

  public async update(
    where: FindOptionsWhere<Erc998AirdropEntity>,
    dto: Partial<IErc998AirdropItem>,
  ): Promise<Erc998AirdropEntity> {
    const airdropEntity = await this.findOne(where);

    if (!airdropEntity) {
      throw new NotFoundException("airdropNotFound");
    }

    // Update only NEW Airdrops
    if (airdropEntity.airdropStatus !== Erc998AirdropStatus.NEW) {
      throw new NotFoundException("airdropRedeemed");
    }

    const signature = await this.getSign({
      owner: dto.owner,
      airdropId: airdropEntity.id,
      templateId: dto.erc998TemplateId,
    });
    Object.assign(airdropEntity, { ...dto, signature });

    return airdropEntity.save();
  }

  public async getSign(data: Record<string, any>): Promise<string> {
    return this.signer._signTypedData(
      {
        name: "ERC998Airdrop",
        version: "1.0.0",
        chainId: ~~this.configService.get<string>("CHAIN_ID", "1337"),
        verifyingContract: this.configService.get<string>("ERC998_AIRDROP_ADDR", ""),
      },
      prepareEip712(data),
      data,
    );
  }
}
