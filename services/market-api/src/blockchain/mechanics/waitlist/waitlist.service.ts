import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { IWaitlistItemCreateDto } from "./interfaces";
import { WaitlistEntity } from "./waitlist.entity";

@Injectable()
export class WaitlistService {
  constructor(
    @InjectRepository(WaitlistEntity)
    private readonly whitelistEntityRepository: Repository<WaitlistEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<WaitlistEntity>,
    options?: FindOneOptions<WaitlistEntity>,
  ): Promise<WaitlistEntity | null> {
    return this.whitelistEntityRepository.findOne({ where, ...options });
  }

  public async create(dto: IWaitlistItemCreateDto): Promise<WaitlistEntity> {
    const whitelistEntity = await this.findOne(dto);

    if (whitelistEntity) {
      throw new ConflictException("duplicateAccount");
    }

    return this.whitelistEntityRepository.create(dto).save();
  }
}
