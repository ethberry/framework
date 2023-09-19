import { Module } from "@nestjs/common";

import { OtpModule } from "../otp/otp.module";
import { UserModule } from "../user/user.module";
import { InvitationService } from "./invitation.service";
import { InvitationController } from "./invitation.controller";

@Module({
  imports: [UserModule, OtpModule],
  providers: [InvitationService],
  controllers: [InvitationController],
  exports: [InvitationService],
})
export class InvitationModule {}
