import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IWhitelistItemCreateDto } from "./interfaces";
import { WhitelistEntity } from "./whitelist.entity";

@Injectable()
export class WhitelistService {
  constructor(
    @InjectRepository(WhitelistEntity)
    private readonly whitelistEntityRepository: Repository<WhitelistEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<WhitelistEntity>,
    options?: FindOneOptions<WhitelistEntity>,
  ): Promise<WhitelistEntity | null> {
    return this.whitelistEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IWhitelistItemCreateDto): Promise<WhitelistEntity> {
    const whitelistEntity = await this.findOne(dto);

    if (whitelistEntity) {
      throw new ConflictException("duplicateAccount");
    }

    return this.whitelistEntityRepository.create(dto).save();
  }
}
