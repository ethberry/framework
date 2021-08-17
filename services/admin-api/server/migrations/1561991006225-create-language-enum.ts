import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@gemunion/framework-constants-misc";

export class CreateLanguageEnum1561991006225 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.language_enum AS ENUM (
        'RU',
        'EN'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TYPE ${ns}.language_enum;`);
  }
}
