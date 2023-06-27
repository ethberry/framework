import { ForbiddenException, Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { IContractSearchDto, ModuleType, TokenType } from "@framework/types";

import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { CollectionTokenService } from "../token/token.service";
import { ICollectionUploadDto } from "./interfaces";

@Injectable()
export class CollectionContractService extends ContractService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
    protected readonly collectionTokenService: CollectionTokenService,
  ) {
    super(contractEntityRepository);
  }

  public search(dto: IContractSearchDto, userEntity: UserEntity): Promise<[Array<ContractEntity>, number]> {
    return super.search(
      Object.assign(dto, { contractType: [TokenType.ERC721], contractModule: [ModuleType.COLLECTION] }),
      userEntity,
    );
  }

  public async upload(address: string, dto: ICollectionUploadDto, userEntity: UserEntity): Promise<Array<TokenEntity>> {
    const { tokens } = dto;

    const contractEntity = await this.findOne(
      { address, chainId: userEntity.chainId },
      { relations: { templates: true } },
    );

    if (!contractEntity) {
      throw new NotFoundException("collectionNotFound");
    }

    if (contractEntity.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    // should be only one template per collection
    if (contractEntity.templates.length !== 1) {
      throw new NotFoundException("templateNotFound");
    }

    return this.collectionTokenService.updateTokensBatch(contractEntity.templates[0].id, tokens);
  }
}
