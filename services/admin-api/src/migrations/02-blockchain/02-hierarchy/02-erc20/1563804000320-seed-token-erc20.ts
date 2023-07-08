import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedTokenErc20At1563804000320 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const defaultJSON = JSON.stringify({});

    await queryRunner.query(`
      INSERT INTO ${ns}.token (
        id,
        metadata,
        royalty,
        token_id,
        token_status,
        template_id,
        created_at,
        updated_at
      ) VALUES (
        102010101, -- Space Credits
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        1020101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102020101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        1020201,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102030101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        1020301,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102040101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        1020401,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102050101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        1020501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102800101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        1028001,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
