import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { IContractSearchDto, IErc20ContractCreateDto } from "@framework/types";
import { ContractFeatures, ModuleType, TokenType } from "@framework/types";
import { testChainId } from "@framework/constants";

import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { UserEntity } from "../../../../user/user.entity";

@Injectable()
export class Erc20ContractService extends ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
    @InjectRepository(TemplateEntity)
    protected readonly templateEntityRepository: Repository<TemplateEntity>,
    @InjectRepository(TokenEntity)
    protected readonly tokenEntityRepository: Repository<TokenEntity>,
    protected readonly configService: ConfigService,
  ) {
    super(contractEntityRepository);
  }

  public search(dto: IContractSearchDto, userEntity: UserEntity): Promise<[Array<ContractEntity>, number]> {
    return super.search(dto, userEntity, TokenType.ERC20, ModuleType.HIERARCHY);
  }

  public async create(dto: IErc20ContractCreateDto): Promise<ContractEntity> {
    const { address, symbol, decimals, title, description } = dto;
    const chainId = ~~this.configService.get<number>("CHAIN_ID", testChainId);

    const contractEntity = await this.contractEntityRepository
      .create({
        address,
        symbol,
        decimals,
        royalty: 0,
        contractType: TokenType.ERC20,
        contractFeatures: [ContractFeatures.EXTERNAL],
        name: title,
        title,
        description,
        chainId,
        imageUrl: "",
      })
      .save();

    const templateEntity = await this.templateEntityRepository
      .create({
        title,
        description,
        contract: contractEntity,
        imageUrl: "",
      })
      .save();

    await this.tokenEntityRepository
      .create({
        attributes: "{}",
        tokenId: "0",
        royalty: 0,
        template: templateEntity,
      })
      .save();

    return contractEntity;
  }
}
