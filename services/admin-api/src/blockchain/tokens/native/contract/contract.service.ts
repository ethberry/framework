import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";
import { ZeroAddress } from "ethers";

import { PaymentRequiredException } from "@gemunion/nest-js-utils";
import type { IContractSearchDto, INativeContractCreateDto } from "@framework/types";
import { BusinessType, ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

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
    return super.search(dto, userEntity, [ModuleType.HIERARCHY], [TokenType.NATIVE]);
  }

  public async create(dto: INativeContractCreateDto, userEntity: UserEntity): Promise<ContractEntity> {
    const { symbol, title, description } = dto;

    const businessType = this.configService.get<BusinessType>("BUSINESS_TYPE", BusinessType.B2B);
    if (businessType === BusinessType.B2B && userEntity.merchantId !== 1) {
      throw new PaymentRequiredException("paymentRequired");
    }

    const contractEntity = await this.contractEntityRepository
      .create({
        address: ZeroAddress,
        symbol,
        decimals: 18,
        royalty: 0,
        contractType: TokenType.NATIVE,
        contractFeatures: [ContractFeatures.EXTERNAL],
        contractModule: ModuleType.HIERARCHY,
        contractStatus: ContractStatus.ACTIVE,
        name: title,
        title,
        description,
        chainId: userEntity.chainId,
        imageUrl: "",
        merchantId: userEntity.merchantId,
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
