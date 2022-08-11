import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ReferralEntity } from "./referral.entity";

@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(ReferralEntity)
    private readonly referralEntityRepository: Repository<ReferralEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<ReferralEntity>,
    options?: FindOneOptions<ReferralEntity>,
  ): Promise<ReferralEntity | null> {
    return this.referralEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<ReferralEntity>,
    options?: FindOneOptions<ReferralEntity>,
  ): Promise<Array<ReferralEntity>> {
    return this.referralEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<ReferralEntity>): Promise<ReferralEntity> {
    return this.referralEntityRepository.create(dto).save();
  }
}
