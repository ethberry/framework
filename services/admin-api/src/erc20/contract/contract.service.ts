import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ContractTemplate, IContractSearchDto, IErc20TokenCreateDto, TokenType } from "@framework/types";

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

  public search(dto: IContractSearchDto): Promise<[Array<ContractEntity>, number]> {
    return super.search(dto, TokenType.ERC20);
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
