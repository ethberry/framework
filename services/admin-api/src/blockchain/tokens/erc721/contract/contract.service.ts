import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";

import { PaymentRequiredException } from "@gemunion/nest-js-utils";
import type { IContractSearchDto, IErc721ContractCreateDto } from "@framework/types";
import { BusinessType, ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractService } from "../../../hierarchy/contract/contract.service";

@Injectable()
export class Erc721ContractService extends ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
    protected readonly configService: ConfigService,
  ) {
    super(contractEntityRepository, configService);
  }

  public search(dto: IContractSearchDto, userEntity: UserEntity): Promise<[Array<ContractEntity>, number]> {
    return super.search(dto, userEntity, [ModuleType.HIERARCHY], [TokenType.ERC721]);
  }

  public async create(dto: IErc721ContractCreateDto, userEntity: UserEntity): Promise<ContractEntity> {
    const { address, symbol, title, description, imageUrl } = dto;

    const businessType = this.configService.get<BusinessType>("BUSINESS_TYPE", BusinessType.B2B);
    // there is no exception for merchantId=1, to create token use office
    if (businessType === BusinessType.B2B) {
      throw new PaymentRequiredException("paymentRequired");
    }

    return this.contractEntityRepository
      .create({
        address,
        symbol,
        royalty: 0,
        contractType: TokenType.ERC721,
        contractFeatures: [ContractFeatures.EXTERNAL],
        contractStatus: ContractStatus.ACTIVE,
        name: title,
        title,
        description,
        imageUrl,
        chainId: userEntity.chainId,
        merchantId: userEntity.merchantId,
      })
      .save();
  }
}
