import { Module } from "@nestjs/common";

import { S3Controller, S3Module } from "@gemunion/nest-js-module-s3";

@Module({
  imports: [S3Module.deferred()],
  controllers: [S3Controller],
})
export class FileModule {}
