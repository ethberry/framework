import { Module, Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { S3Module, ISdkOptions, IS3Options } from "@gemunion/nest-js-module-s3";

import { PuppeteerController } from "./puppeteer.controller";
import { PuppeteerService } from "./puppeteer.service";

@Module({
  imports: [
    S3Module.forRootAsync(S3Module, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ISdkOptions & IS3Options => {
        return {
          region: configService.get<string>("AWS_REGION", ""),
          accessKeyId: configService.get<string>("AWS_ACCESS_KEY_ID", ""),
          secretAccessKey: configService.get<string>("AWS_SECRET_ACCESS_KEY", ""),
          bucket: configService.get<string>("AWS_S3_BUCKET", ""),
        };
      },
    }),
  ],
  controllers: [PuppeteerController],
  providers: [Logger, PuppeteerService],
})
export class PuppeteerModule {}
