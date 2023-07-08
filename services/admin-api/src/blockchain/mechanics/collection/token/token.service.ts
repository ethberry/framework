import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ITokenSearchDto, ModuleType, TokenType } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TokenService } from "../../../hierarchy/token/token.service";
import { ITokenUploadDto } from "../contract/interfaces";

@Injectable()
export class CollectionTokenService extends TokenService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(TokenEntity)
    protected readonly tokenEntityRepository: Repository<TokenEntity>,
  ) {
    super(tokenEntityRepository);
  }

  public findOneToken(
    where: FindOptionsWhere<TokenEntity>,
    options?: FindOneOptions<TokenEntity>,
  ): Promise<TokenEntity | null> {
    return this.tokenEntityRepository.findOne({ where, ...options });
  }

  public search(dto: ITokenSearchDto, userEntity: UserEntity): Promise<[Array<TokenEntity>, number]> {
    return super.search(dto, userEntity, TokenType.ERC721, ModuleType.COLLECTION);
  }

  public getAllTokens(templateId: number): Promise<Array<TokenEntity>> {
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

  public async updateTokensBatch(templateId: number, files: Array<ITokenUploadDto>): Promise<Array<TokenEntity>> {
    const tokens = await this.getAllTokens(templateId);

    if (!tokens.length) {
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
        metadata: JSON.parse(file.metadata),
      });
    });

    return this.tokenEntityRepository.save(tokens, { chunk: 1000 }).then(res => {
      this.loggerService.log(`UPDATE ${res.length} OK`, CollectionTokenService.name);
      return res;
    });
  }
}
