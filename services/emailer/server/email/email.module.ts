import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {SesModule, ISesOptions, ISdkOptions} from "@trejgun/nest-js-module-ses";

import {EmailController} from "./email.controller";
import {EmailService} from "./email.service";

@Module({
  imports: [
    SesModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ISdkOptions & ISesOptions => {
        return {
          region: configService.get<string>("AWS_REGION", ""),
          accessKeyId: configService.get<string>("AWS_ACCESS_KEY_ID", ""),
          secretAccessKey: configService.get<string>("AWS_SECRET_ACCESS_KEY", ""),
          from: configService.get<string>("AWS_FROM", ""),
        };
      },
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
