import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ReferralHistoryEntity } from "./hystory.entity";

@Injectable()
export class ReferralHistoryService {
  constructor(
    @InjectRepository(ReferralHistoryEntity)
    private readonly referralHistoryEntityRepository: Repository<ReferralHistoryEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<ReferralHistoryEntity>,
    options?: FindOneOptions<ReferralHistoryEntity>,
  ): Promise<ReferralHistoryEntity | null> {
    return this.referralHistoryEntityRepository.findOne({ where, ...options });
  }
}
