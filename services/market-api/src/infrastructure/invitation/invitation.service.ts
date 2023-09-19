import { Injectable, NotFoundException } from "@nestjs/common";

import { UserRole } from "@framework/types";

import { UserService } from "../user/user.service";
import { OtpService } from "../otp/otp.service";

@Injectable()
export class InvitationService {
  constructor(
    private readonly otpService: OtpService,
    private readonly userService: UserService,
  ) {}

  public async accept(uuid: string): Promise<void> {
    const otpEntity = await this.otpService.findOne({ uuid });

    if (!otpEntity) {
      throw new NotFoundException("otpNotFound");
    }

    await this.userService.update({ id: otpEntity.userId }, { merchantId: otpEntity.data.merchantId });
    await this.userService.addRole({ id: otpEntity.userId }, UserRole.MANAGER);

    await otpEntity.remove();
  }
}
