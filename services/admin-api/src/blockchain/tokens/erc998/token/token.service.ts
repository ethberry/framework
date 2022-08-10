import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ITokenSearchDto, TokenType } from "@framework/types";

import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TokenService } from "../../../hierarchy/token/token.service";

@Injectable()
export class Erc998TokenService extends TokenService {
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
