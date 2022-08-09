import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ITokenSearchDto, TokenType } from "@framework/types";

import { TokenEntity } from "../../../blockchain/hierarchy/token/token.entity";
import { TokenService } from "../../../blockchain/hierarchy/token/token.service";

@Injectable()
export class Erc721TokenService extends TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    protected readonly tokenEntityRepository: Repository<TokenEntity>,
  ) {
    super(tokenEntityRepository);
  }

  public async search(dto: ITokenSearchDto): Promise<[Array<TokenEntity>, number]> {
    return super.search(dto, TokenType.ERC721);
  }
}
