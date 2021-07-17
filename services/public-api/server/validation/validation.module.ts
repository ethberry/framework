import {Module} from "@nestjs/common";
import {HttpModule} from "@nestjs/axios";
import {ConfigModule} from "@nestjs/config";

import {ValidateReCaptcha, ValidateEmail} from "../common/validators";
import {UserModule} from "../user/user.module";

@Module({
  imports: [HttpModule, UserModule, ConfigModule],
  providers: [ValidateReCaptcha, ValidateEmail],
})
export class ValidationModule {}
