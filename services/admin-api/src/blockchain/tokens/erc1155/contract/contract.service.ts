import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";

import { PaymentRequiredException } from "@gemunion/nest-js-utils";
import type { IContractSearchDto, IErc1155ContractCreateDto } from "@framework/types";
import { BusinessType, ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@Injectable()
export class Erc1155ContractService extends ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
    protected readonly configService: ConfigService,
  ) {
    super(contractEntityRepository);
  }

  public search(dto: IContractSearchDto, userEntity: UserEntity): Promise<[Array<ContractEntity>, number]> {
    return super.search(dto, userEntity, [ModuleType.HIERARCHY], [TokenType.ERC1155]);
  }

  public async create(dto: IErc1155ContractCreateDto, userEntity: UserEntity): Promise<ContractEntity> {
    const { address, title, description, imageUrl } = dto;

    const businessType = this.configService.get<BusinessType>("BUSINESS_TYPE", BusinessType.B2B);
    if (businessType === BusinessType.B2B) {
      throw new PaymentRequiredException("paymentRequired");
    }

    return this.contractEntityRepository
      .create({
        address,
        royalty: 0,
        contractType: TokenType.ERC1155,
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
