import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { IContractSearchDto, IErc20ContractCreateDto } from "@framework/types";
import { ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

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
    super(contractEntityRepository, configService);
  }

  public search(dto: IContractSearchDto, userEntity: UserEntity): Promise<[Array<ContractEntity>, number]> {
    return super.search(dto, userEntity, [ModuleType.HIERARCHY], [TokenType.ERC20]);
  }

  public async create(dto: IErc20ContractCreateDto, userEntity: UserEntity): Promise<ContractEntity> {
    const { address, symbol, decimals, title, description, merchantId } = dto;

    const contractEntity = await this.contractEntityRepository
      .create({
        address,
        symbol,
        decimals,
        royalty: 0,
        contractType: TokenType.ERC20,
        contractFeatures: [ContractFeatures.EXTERNAL],
        contractStatus: ContractStatus.ACTIVE,
        name: title,
        title,
        description,
        imageUrl: "",
        chainId: userEntity.chainId,
        merchantId,
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
        metadata: "{}",
        tokenId: "0",
        royalty: 0,
        template: templateEntity,
      })
      .save();

    return contractEntity;
  }
}
