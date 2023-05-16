import { MigrationInterface, QueryRunner } from "typeorm";

import { loremIpsum } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedSettings1563803000020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.settings (
        key,
        value
      ) VALUES (
        'DUMMY',
        '${JSON.stringify(loremIpsum)}'
      ), (
        'SIGNATURE_TTL',
        '${JSON.stringify(0)}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.settings`);
  }
}
