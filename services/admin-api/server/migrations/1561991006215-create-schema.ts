import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@gemunion/framework-constants-misc";

export class CreateSchema1561991006215 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createSchema(ns, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropSchema(ns);
  }
}
