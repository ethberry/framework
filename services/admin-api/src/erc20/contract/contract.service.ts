import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import {
  IErc20ContractAutocompleteDto,
  IErc20ContractSearchDto,
  IErc20TokenCreateDto,
  TokenType,
  ContractStatus,
  ContractTemplate,
  TemplateStatus,
} from "@framework/types";

import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";
import { ContractEntity } from "../../blockchain/hierarchy/contract/contract.entity";
import { IErc20ContractUpdateDto } from "./interfaces";

@Injectable()
export class Erc20ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractEntityRepository: Repository<ContractEntity>,
    @InjectRepository(TemplateEntity)
    private readonly templateEntityRepository: Repository<TemplateEntity>,
    private readonly configService: ConfigService,
  ) {}

  public async search(dto: IErc20ContractSearchDto): Promise<[Array<ContractEntity>, number]> {
    const { query, contractStatus, contractTemplate, skip, take } = dto;

    const queryBuilder = this.contractEntityRepository.createQueryBuilder("contract");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("contract.templates", "templates");

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

  public async autocomplete(dto: IErc20ContractAutocompleteDto): Promise<Array<ContractEntity>> {
    const { contractTemplate = [] } = dto;

    const queryBuilder = this.contractEntityRepository.createQueryBuilder("template");

    queryBuilder.andWhere("template.templateStatus = :templateStatus", { templateStatus: TemplateStatus.ACTIVE });

    queryBuilder.select(["id", "title", "decimals"]);

    if (contractTemplate.length) {
      queryBuilder.leftJoin("template.contract", "contract");
      queryBuilder.andWhere("contract.contractTemplate IN(:...contractTemplate)", { contractTemplate });
    }

    return queryBuilder.getMany();
  }

  public findOne(
    where: FindOptionsWhere<ContractEntity>,
    options?: FindOneOptions<ContractEntity>,
  ): Promise<ContractEntity | null> {
    return this.contractEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IErc20TokenCreateDto): Promise<ContractEntity> {
    const { address, symbol, decimals, contractTemplate, title, description } = dto;
    const chainId = ~~this.configService.get<string>("CHAIN_ID", "1337");

    const contractEntity = await this.contractEntityRepository
      .create({
        address,
        symbol,
        royalty: 0,
        contractType: TokenType.ERC20,
        contractTemplate: contractTemplate as unknown as ContractTemplate,
        name: title,
        title,
        description,
        chainId,
        imageUrl: "",
      })
      .save();

    await this.templateEntityRepository
      .create({
        decimals,
        title,
        description,
        contract: contractEntity,
        imageUrl: "",
        attributes: "{}",
      })
      .save();

    return contractEntity;
  }

  public async update(
    where: FindOptionsWhere<ContractEntity>,
    dto: Partial<IErc20ContractUpdateDto>,
  ): Promise<ContractEntity> {
    const contractEntity = await this.findOne(where);

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    Object.assign(contractEntity, dto);

    return contractEntity.save();
  }

  public async delete(where: FindOptionsWhere<TemplateEntity>): Promise<ContractEntity> {
    return this.update(where, { contractStatus: ContractStatus.INACTIVE });
  }
}
