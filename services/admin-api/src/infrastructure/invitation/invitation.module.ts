import { Logger, Module } from "@nestjs/common";

import { OtpModule } from "../otp/otp.module";
import { UserModule } from "../user/user.module";
import { EmailModule } from "../email/email.module";
import { InvitationService } from "./invitation.service";
import { InvitationController } from "./invitation.controller";

@Module({
  imports: [UserModule, OtpModule, EmailModule],
  providers: [Logger, InvitationService],
  controllers: [InvitationController],
  exports: [InvitationService],
})
export class InvitationModule {}
