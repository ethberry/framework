import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@gemunion/framework-constants-misc";

export class CreateSchema1561991006215 implements MigrationInterface {
  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropSchema(ns);
  }

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createSchema(ns, true);
  }
}
