import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import csv2json from "csvtojson";
import { validateSync } from "class-validator";

import { IContractSearchDto, ModuleType, TokenType } from "@framework/types";

import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { CollectionUploadDto, TokenUploadDto } from "./dto";
import { CollectionTokenService } from "../token/token.service";

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

  public async updateTokensBatch(address: string, dto: CollectionUploadDto): Promise<Array<TokenEntity>> {
    const { files } = dto;
    const contractEntity = await this.findOne({ address }, { relations: { templates: true } });

    if (!contractEntity) {
      throw new NotFoundException("collectionNotFound");
    }

    // should be only one template per collection
    if (contractEntity.templates.length > 1) {
      throw new NotFoundException("templateNotFound");
    }

    // todo use user.chainID or csv.chainId
    return this.collectionTokenService.updateTokensBatch(contractEntity.templates[0].id, files);
  }

  public async upload(address: string, file: Express.Multer.File): Promise<Array<TokenEntity>> {
    const parsed = await csv2json({
      noheader: true,
      headers: ["tokenId", "imageUrl", "metadata"],
    }).fromString(file.buffer.toString());

    const files = parsed.map(
      ({ tokenId, imageUrl, metadata }: { tokenId: string; imageUrl: string; metadata: string }) => {
        return Object.assign(new TokenUploadDto(), {
          tokenId,
          imageUrl,
          metadata,
        });
      },
    );

    const schema = new CollectionUploadDto();
    schema.files = files;
    const result = validateSync(schema);

    if (result.length) {
      this.loggerService.log(result, CollectionContractService.name);
      throw result;
    }

    return this.updateTokensBatch(address, { files });
  }
}
