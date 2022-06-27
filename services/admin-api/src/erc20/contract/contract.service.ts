import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import {
  IErc20ContractAutocompleteDto,
  IErc20ContractSearchDto,
  IErc20TokenCreateDto,
  UniContractStatus,
  UniContractTemplate,
  UniTemplateStatus,
} from "@framework/types";

import { IErc20TemplateUpdateDto } from "./interfaces";
import { UniTemplateEntity } from "../../uni-token/uni-template.entity";
import { UniContractEntity } from "../../uni-token/uni-contract.entity";

@Injectable()
export class Erc20ContractService {
  constructor(
    @InjectRepository(UniContractEntity)
    private readonly uniContractEntityRepository: Repository<UniContractEntity>,
    @InjectRepository(UniTemplateEntity)
    private readonly uniTemplateEntityRepository: Repository<UniTemplateEntity>,
    private readonly configService: ConfigService,
  ) {}

  public async search(dto: IErc20ContractSearchDto): Promise<[Array<UniTemplateEntity>, number]> {
    const { query, contractStatus, contractTemplate, skip, take } = dto;

    const queryBuilder = this.uniTemplateEntityRepository.createQueryBuilder("token");

    queryBuilder.select();

    if (contractStatus) {
      if (contractStatus.length === 1) {
        queryBuilder.andWhere("token.contractStatus = :contractStatus", { contractStatus: contractStatus[0] });
      } else {
        queryBuilder.andWhere("token.contractStatus IN(:...contractStatus)", { contractStatus });
      }
    }

    if (contractTemplate) {
      if (contractTemplate.length === 1) {
        queryBuilder.andWhere("token.contractTemplate = :contractTemplate", { contractTemplate: contractTemplate[0] });
      } else {
        queryBuilder.andWhere("token.contractTemplate IN(:...contractTemplate)", { contractTemplate });
      }
    }

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(token.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("token.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "token.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: IErc20ContractAutocompleteDto): Promise<Array<UniTemplateEntity>> {
    const { contractTemplate = [] } = dto;

    const queryBuilder = this.uniTemplateEntityRepository.createQueryBuilder("template");

    queryBuilder.andWhere("template.templateStatus = :templateStatus", { templateStatus: UniTemplateStatus.ACTIVE });

    queryBuilder.select(["id", "title", "decimals"]);
    queryBuilder.leftJoin("template.contract", "contract");

    if (contractTemplate.length) {
      queryBuilder.andWhere("contract.contractTemplate IN(:...contractTemplate)", { contractTemplate });
    }

    return queryBuilder.getMany();
  }

  public findOne(
    where: FindOptionsWhere<UniTemplateEntity>,
    options?: FindOneOptions<UniTemplateEntity>,
  ): Promise<UniTemplateEntity | null> {
    return this.uniTemplateEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IErc20TokenCreateDto): Promise<UniTemplateEntity> {
    const { address, symbol, decimals, contractTemplate, title, description } = dto;
    const chainId = ~~this.configService.get<string>("CHAIN_ID", "1337");
    const contractEntity = await this.uniContractEntityRepository
      .create({
        address,
        symbol,
        contractTemplate: contractTemplate as unknown as UniContractTemplate,
        title,
        description,
        chainId,
      })
      .save();

    return this.uniTemplateEntityRepository
      .create({
        decimals,
        title,
        description,
        uniContract: contractEntity,
      })
      .save();
  }

  public async update(
    where: FindOptionsWhere<UniTemplateEntity>,
    dto: Partial<IErc20TemplateUpdateDto>,
  ): Promise<UniTemplateEntity> {
    const tokenEntity = await this.findOne(where);

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    Object.assign(tokenEntity, dto);

    return tokenEntity.save();
  }

  public async delete(where: FindOptionsWhere<UniTemplateEntity>): Promise<UniTemplateEntity> {
    return this.update(where, { contractStatus: UniContractStatus.INACTIVE });
  }
}
