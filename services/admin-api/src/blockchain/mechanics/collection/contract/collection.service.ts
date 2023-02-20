import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import csv2json from "csvtojson";
import { validateSync } from "class-validator";

import { IContractSearchDto, ITemplateSearchDto, ITokenSearchDto, ModuleType, TokenType } from "@framework/types";

import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { UserEntity } from "../../../../ecommerce/user/user.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { CollectionUploadDto, TokenUploadDto } from "./dto";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { TokenService } from "../../../hierarchy/token/token.service";

@Injectable()
export class Erc721CollectionService extends ContractService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(ContractEntity)
    protected readonly contractEntityRepository: Repository<ContractEntity>,
    @InjectRepository(TokenEntity)
    protected readonly tokenEntityRepository: Repository<TokenEntity>,
    @InjectRepository(TemplateEntity)
    protected readonly templateEntityRepository: Repository<TemplateEntity>,
    protected readonly templateService: TemplateService,
    protected readonly tokenService: TokenService,
  ) {
    super(contractEntityRepository);
  }

  public search(dto: IContractSearchDto, userEntity: UserEntity): Promise<[Array<ContractEntity>, number]> {
    return super.search(
      Object.assign(dto, { contractType: [TokenType.ERC721], contractModule: [ModuleType.COLLECTION] }),
      userEntity,
    );
  }

  public searchTemplates(dto: ITemplateSearchDto, userEntity: UserEntity): Promise<[Array<TemplateEntity>, number]> {
    return this.templateService.search(dto, userEntity, TokenType.ERC721, ModuleType.COLLECTION);
  }

  public findOneTemplate(
    where: FindOptionsWhere<TemplateEntity>,
    options?: FindOneOptions<TemplateEntity>,
  ): Promise<TemplateEntity | null> {
    return this.templateEntityRepository.findOne({ where, ...options });
  }

  public findOneToken(
    where: FindOptionsWhere<TokenEntity>,
    options?: FindOneOptions<TokenEntity>,
  ): Promise<TokenEntity | null> {
    return this.tokenEntityRepository.findOne({ where, ...options });
  }

  public searchTokens(dto: ITokenSearchDto, userEntity: UserEntity): Promise<[Array<TokenEntity>, number]> {
    return this.tokenService.search(dto, userEntity, TokenType.ERC721, ModuleType.COLLECTION);
  }

  public getAllTokens(templateId: number): Promise<Array<TokenEntity> | null> {
    const queryBuilder = this.tokenEntityRepository.createQueryBuilder("tokens");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("tokens.template", "template");

    if (templateId) {
      queryBuilder.andWhere("template.id = :templateId", {
        templateId,
      });
    }

    queryBuilder.orderBy("tokens.tokenId", "ASC");

    return queryBuilder.getMany();
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
    const tokens = await this.getAllTokens(contractEntity.templates[0].id);

    if (!tokens) {
      throw new NotFoundException("tokensNotFound");
    }

    // arrays must be equal
    // todo more check?
    if (files.length !== tokens.length) {
      throw new NotFoundException("tokensArrayLengthMismatch");
    }

    files.map((file, i) => {
      return Object.assign(tokens[i], {
        imageUrl: file.imageUrl,
        attributes: JSON.stringify(JSON.parse(file.attributes)),
      });
    });

    // const result = await this.tokenEntityRepository.save(tokens, { chunk: 1000 });
    // this.loggerService.log(`UPLOAD ${result.length} OK`, Erc721CollectionService.name);
    // return result;

    return await this.tokenEntityRepository.save(tokens, { chunk: 1000 }).then(res => {
      this.loggerService.log(`UPDATE ${res.length} OK`, Erc721CollectionService.name);
      return res;
    });
  }

  public async upload(address: string, file: Express.Multer.File): Promise<Array<TokenEntity>> {
    const parsed = await csv2json({
      noheader: true,
      headers: ["tokenId", "imageUrl", "attributes"],
    }).fromString(file.buffer.toString());

    const files = parsed.map(
      ({ tokenId, imageUrl, attributes }: { tokenId: string; imageUrl: string; attributes: string }) => {
        return Object.assign(new TokenUploadDto(), {
          tokenId,
          imageUrl,
          attributes,
        });
      },
    );

    const schema = new CollectionUploadDto();
    schema.files = files;
    const result = validateSync(schema);

    if (result.length) {
      this.loggerService.log(result, Erc721CollectionService.name);
      throw result;
    }

    return await this.updateTokensBatch(address, { files });
  }
}
