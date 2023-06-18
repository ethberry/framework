import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedBreed1663047650401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.breed (
        id,
        traits,
        count,
        token_id,
        created_at,
        updated_at
      ) VALUES (
        1,
        '1461501638011467653471668687260973553737594307584',
        2,
        103070101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2,
        '1461501638011467653471668687260973553737594307584',
        2,
        103070102,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3,
        '26959946679704843266901878252702677173524145942006256923769273582592',
        0,
        103070103,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.breed RESTART IDENTITY CASCADE;`);
  }
}
