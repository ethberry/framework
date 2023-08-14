import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { FindOptionsWhere } from "typeorm";

import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { OtpService } from "../otp/otp.service";
import { OtpEntity } from "../otp/otp.entity";
import { EmailService } from "../email/email.service";
import { IInvitationCreateDto } from "./interfaces";

@Injectable()
export class InvitationService {
  constructor(
    private readonly otpService: OtpService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  public findAll(userEntity: UserEntity): Promise<Array<OtpEntity>> {
    return this.otpService.findAllInvitations(userEntity);
  }

  public async create(dto: IInvitationCreateDto, userEntity: UserEntity): Promise<void> {
    const userEntity2 = await this.userService.findOne({ id: dto.userId });

    if (!userEntity2) {
      throw new NotFoundException("invitationNotFound");
    }

    await this.emailService.invite(userEntity2, { merchantId: userEntity.merchantId });
  }

  public async delete(where: FindOptionsWhere<OtpEntity>, userEntity: UserEntity): Promise<OtpEntity> {
    const otpEntity = await this.otpService.findOne(where);

    if (!otpEntity) {
      throw new NotFoundException("invitationNotFound");
    }

    if (otpEntity.data.merchantId !== userEntity.merchantId) {
      throw new ForbiddenException("insufficientPermissions");
    }

    return otpEntity.remove();
  }
}
