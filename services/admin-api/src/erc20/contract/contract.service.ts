import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import {
  IErc20ContractAutocompleteDto,
  IErc20ContractSearchDto,
  IErc20TokenCreateDto,
  TokenType,
  UniContractStatus,
  UniContractTemplate,
  UniTemplateStatus,
} from "@framework/types";

import { UniTemplateEntity } from "../../blockchain/uni-token/uni-template.entity";
import { UniContractEntity } from "../../blockchain/uni-token/uni-contract.entity";
import { IErc20ContractUpdateDto } from "./interfaces";

@Injectable()
export class Erc20ContractService {
  constructor(
    @InjectRepository(UniContractEntity)
    private readonly uniContractEntityRepository: Repository<UniContractEntity>,
    @InjectRepository(UniTemplateEntity)
    private readonly uniTemplateEntityRepository: Repository<UniTemplateEntity>,
    private readonly configService: ConfigService,
  ) {}

  public async search(dto: IErc20ContractSearchDto): Promise<[Array<UniContractEntity>, number]> {
    const { query, contractStatus, contractTemplate, skip, take } = dto;

    const queryBuilder = this.uniContractEntityRepository.createQueryBuilder("contract");

    queryBuilder.select();

    queryBuilder.andWhere("contract.contractType = :contractType", { contractType: TokenType.ERC20 });

    if (contractStatus) {
      if (contractStatus.length === 1) {
        queryBuilder.andWhere("contract.contractStatus = :contractStatus", { contractStatus: contractStatus[0] });
      } else {
        queryBuilder.andWhere("contract.contractStatus IN(:...contractStatus)", { contractStatus });
      }
    }

    if (contractTemplate) {
      if (contractTemplate.length === 1) {
        queryBuilder.andWhere("contract.contractTemplate = :contractTemplate", {
          contractTemplate: contractTemplate[0],
        });
      } else {
        queryBuilder.andWhere("contract.contractTemplate IN(:...contractTemplate)", { contractTemplate });
      }
    }

    if (query) {
      queryBuilder.leftJoin(
        "(SELECT 1)",
        "dummy",
        "TRUE LEFT JOIN LATERAL json_array_elements(contract.description->'blocks') blocks ON TRUE",
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("contract.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "contract.createdAt": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(dto: IErc20ContractAutocompleteDto): Promise<Array<UniContractEntity>> {
    const { contractTemplate = [] } = dto;

    const queryBuilder = this.uniContractEntityRepository.createQueryBuilder("template");

    queryBuilder.andWhere("template.templateStatus = :templateStatus", { templateStatus: UniTemplateStatus.ACTIVE });

    queryBuilder.select(["id", "title", "decimals"]);
    queryBuilder.leftJoin("template.contract", "contract");

    if (contractTemplate.length) {
      queryBuilder.andWhere("contract.contractTemplate IN(:...contractTemplate)", { contractTemplate });
    }

    return queryBuilder.getMany();
  }

  public findOne(
    where: FindOptionsWhere<UniContractEntity>,
    options?: FindOneOptions<UniContractEntity>,
  ): Promise<UniContractEntity | null> {
    return this.uniContractEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IErc20TokenCreateDto): Promise<UniContractEntity> {
    const { address, symbol, decimals, contractTemplate, title, description } = dto;
    const chainId = ~~this.configService.get<string>("CHAIN_ID", "1337");

    const contractEntity = await this.uniContractEntityRepository
      .create({
        address,
        symbol,
        royalty: 0,
        contractType: TokenType.ERC20,
        contractTemplate: contractTemplate as unknown as UniContractTemplate,
        name: title,
        title,
        description,
        chainId,
        imageUrl: "",
      })
      .save();

    await this.uniTemplateEntityRepository
      .create({
        decimals,
        title,
        description,
        uniContract: contractEntity,
        imageUrl: "",
        attributes: "{}",
      })
      .save();

    return contractEntity;
  }

  public async update(
    where: FindOptionsWhere<UniContractEntity>,
    dto: Partial<IErc20ContractUpdateDto>,
  ): Promise<UniContractEntity> {
    const contractEntity = await this.findOne(where);

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    Object.assign(contractEntity, dto);

    return contractEntity.save();
  }

  public async delete(where: FindOptionsWhere<UniTemplateEntity>): Promise<UniContractEntity> {
    return this.update(where, { contractStatus: UniContractStatus.INACTIVE });
  }
}
