import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { IContractSearchDto, IErc721ContractCreateDto } from "@framework/types";
import { ContractFeatures, ContractStatus, ModuleType, TokenType } from "@framework/types";

import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@Injectable()
export class Erc721ContractService extends ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
  ) {
    super(contractEntityRepository);
  }

  public search(dto: IContractSearchDto, userEntity: UserEntity): Promise<[Array<ContractEntity>, number]> {
    return super.search(dto, userEntity, [ModuleType.HIERARCHY], [TokenType.ERC721]);
  }

  public async create(dto: IErc721ContractCreateDto, userEntity: UserEntity): Promise<ContractEntity> {
    const { address, symbol, title, description, imageUrl } = dto;

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
