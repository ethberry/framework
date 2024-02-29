import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ReferralProgramEntity } from "./referral.program.entity";

@Injectable()
export class ReferralProgramService {
  constructor(
    @InjectRepository(ReferralProgramEntity)
    private readonly referralProgramEntityRepository: Repository<ReferralProgramEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<ReferralProgramEntity>,
    options?: FindOneOptions<ReferralProgramEntity>,
  ): Promise<ReferralProgramEntity | null> {
    return this.referralProgramEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<ReferralProgramEntity>,
    options?: FindManyOptions<ReferralProgramEntity>,
  ): Promise<Array<ReferralProgramEntity>> {
    return this.referralProgramEntityRepository.find({ where, ...options });
  }
}
