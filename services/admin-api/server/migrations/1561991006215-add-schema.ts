import { MigrationInterface, QueryRunner } from "typeorm";
import { ns } from "@gemunion/framework-constants-misc";

export class AddSchema1561991006215 implements MigrationInterface {
  public schemaName = ns;

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropSchema(this.schemaName);
  }

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createSchema(this.schemaName, true);
  }
}
