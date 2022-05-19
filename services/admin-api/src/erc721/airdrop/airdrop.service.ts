import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { ethers } from "ethers";

import { Erc721AirdropStatus, IErc721AirdropSearchDto } from "@framework/types";
import { prepareEip712 } from "@gemunion/butils";
import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";

import { IErc721AirdropCreateDto, IErc721AirdropItem } from "./interfaces";
import { Erc721AirdropEntity } from "./airdrop.entity";

@Injectable()
export class Erc721AirderopService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: ethers.Wallet,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    @InjectRepository(Erc721AirdropEntity)
    private readonly erc721AirdropEntityRepository: Repository<Erc721AirdropEntity>,
  ) {}

  public async search(dto: Partial<IErc721AirdropSearchDto>): Promise<[Array<Erc721AirdropEntity>, number]> {
    const { skip, take, query, erc721TemplateIds } = dto;

    const queryBuilder = this.erc721AirdropEntityRepository.createQueryBuilder("airdrop");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("airdrop.erc721Template", "template");

    if (query) {
      queryBuilder.andWhere("airdrop.owner ILIKE '%' || :owner || '%'", { owner: query });
    }

    if (erc721TemplateIds) {
      if (erc721TemplateIds.length === 1) {
        queryBuilder.andWhere("airdrop.erc721TemplateId = :erc721TemplateId", {
          erc721TemplateId: erc721TemplateIds[0],
        });
      } else {
        queryBuilder.andWhere("airdrop.erc721TemplateId IN(:...erc721TemplateIds)", { erc721TemplateIds });
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
    where: FindOptionsWhere<Erc721AirdropEntity>,
    options?: FindOneOptions<Erc721AirdropEntity>,
  ): Promise<Erc721AirdropEntity | null> {
    return this.erc721AirdropEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IErc721AirdropCreateDto): Promise<Array<Erc721AirdropEntity | null>> {
    const { list } = dto;

    const results = await Promise.allSettled(
      list.map(async ({ owner, erc721TemplateId }) => {
        let signature = "0x";
        const airdropEntity = await this.erc721AirdropEntityRepository
          .create({ owner, erc721TemplateId, signature })
          .save();
        signature = await this.getSign({
          owner,
          airdropId: airdropEntity.id,
          templateId: erc721TemplateId,
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

  public async delete(where: FindOptionsWhere<Erc721AirdropEntity>): Promise<DeleteResult> {
    return this.erc721AirdropEntityRepository.delete(where);
  }

  public async update(
    where: FindOptionsWhere<Erc721AirdropEntity>,
    dto: Partial<IErc721AirdropItem>,
  ): Promise<Erc721AirdropEntity> {
    const airdropEntity = await this.findOne(where);

    if (!airdropEntity) {
      throw new NotFoundException("airdropNotFound");
    }

    // Update only NEW Airdrops
    if (airdropEntity.airdropStatus !== Erc721AirdropStatus.NEW) {
      throw new NotFoundException("airdropRedeemed");
    }

    const signature = await this.getSign({
      owner: dto.owner,
      airdropId: airdropEntity.id,
      templateId: dto.erc721TemplateId,
    });
    Object.assign(airdropEntity, { ...dto, signature });

    return airdropEntity.save();
  }

  public async getSign(data: Record<string, any>): Promise<string> {
    return this.signer._signTypedData(
      {
        name: "AirdropERC721",
        version: "1.0.0",
        chainId: ~~this.configService.get<number>("CHAIN_ID", 97),
        verifyingContract: this.configService.get<string>("ERC721_AIRDROP_ADDR", ""),
      },
      prepareEip712(data),
      data,
    );
  }
}
