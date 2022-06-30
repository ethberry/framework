import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";

import { ContractTemplate, IErc20ContractSearchDto, IErc20TokenCreateDto, TokenType } from "@framework/types";

import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";
import { ContractEntity } from "../../blockchain/hierarchy/contract/contract.entity";
import { ContractService } from "../../blockchain/hierarchy/contract/contract.service";

@Injectable()
export class Erc20ContractService extends ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
    @InjectRepository(TemplateEntity)
    protected readonly templateEntityRepository: Repository<TemplateEntity>,
    protected readonly configService: ConfigService,
  ) {
    super(contractEntityRepository);
  }

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
}
