import { ForbiddenException, Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { FindOptionsWhere } from "typeorm";

import type { IInvitationCreateDto } from "@framework/types";

import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { OtpService } from "../otp/otp.service";
import { OtpEntity } from "../otp/otp.entity";
import { EmailService } from "../email/email.service";

@Injectable()
export class InvitationService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly otpService: OtpService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  public findAll(userEntity: UserEntity): Promise<[Array<OtpEntity>, number]> {
    return this.otpService.findAllInvitations(userEntity);
  }

  public async create(dto: IInvitationCreateDto, userEntity: UserEntity): Promise<void> {
    const inviteeEntity = await this.userService.findOne(dto);

    if (!inviteeEntity) {
      this.loggerService.log(
        `User ${userEntity.displayName} (#${userEntity.id}) invited ${dto.email} but there is no user with such email`,
      );
      return;
    }

    await this.emailService.invite(inviteeEntity, userEntity);
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
