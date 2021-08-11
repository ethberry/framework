import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";

import {ISdkOptions, IS3Options, S3Module} from "@gemunionstudio/nest-js-module-s3";

import {PromoService} from "./promo.service";
import {PromoEntity} from "./promo.entity";
import {PromoController} from "./promo.controller";

@Module({
  imports: [
    S3Module.forRootAsync({
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
    TypeOrmModule.forFeature([PromoEntity]),
  ],
  providers: [PromoService],
  controllers: [PromoController],
  exports: [PromoService],
})
export class PromoModule {}
