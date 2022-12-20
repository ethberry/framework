import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { constants } from "ethers";

import {
  ContractFeatures,
  ContractStatus,
  IContractSearchDto,
  INativeContractCreateDto,
  ModuleType,
  TokenType,
} from "@framework/types";
import { testChainId } from "@framework/constants";

import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { UserEntity } from "../../../../user/user.entity";

@Injectable()
export class NativeContractService extends ContractService {
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
    return super.search(dto, userEntity, TokenType.NATIVE, ModuleType.HIERARCHY);
  }

  public async create(dto: INativeContractCreateDto): Promise<ContractEntity> {
    const { symbol, title, description } = dto;
    const chainId = ~~this.configService.get<number>("CHAIN_ID", testChainId);

    const contractEntity = await this.contractEntityRepository
      .create({
        address: constants.AddressZero,
        symbol,
        decimals: 18,
        royalty: 0,
        contractType: TokenType.NATIVE,
        contractFeatures: [ContractFeatures.NATIVE],
        contractModule: ModuleType.HIERARCHY,
        contractStatus: ContractStatus.ACTIVE,
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
