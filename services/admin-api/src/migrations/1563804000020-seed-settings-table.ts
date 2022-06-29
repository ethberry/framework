import { MigrationInterface, QueryRunner } from "typeorm";

import { loremIpsum } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedSettingsTable1563804000020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.settings (
        key,
        value
      ) VALUES (
        'DUMMY',
        '${loremIpsum}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.settings`);
  }
}
