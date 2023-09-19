import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { OtpType } from "@framework/types";

import { OtpEntity } from "./otp.entity";
import { UserEntity } from "../user/user.entity";

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OtpEntity)
    private readonly otpEntityRepository: Repository<OtpEntity>,
  ) {}

  public findOne(where: FindOptionsWhere<OtpEntity>, options?: FindOneOptions<OtpEntity>): Promise<OtpEntity | null> {
    return this.otpEntityRepository.findOne({ where, ...options });
  }

  public async getOtp(otpType: OtpType, userEntity: UserEntity, data?: Record<string, any>): Promise<OtpEntity> {
    // working around https://github.com/typeorm/typeorm/issues/1090
    const otpEntity = await this.findOne({
      otpType,
      userId: userEntity.id,
    });

    if (otpEntity) {
      // update timestamps
      return otpEntity.save();
    } else {
      return this.otpEntityRepository
        .create({
          otpType,
          user: userEntity,
          data,
        })
        .save();
    }
  }
}
