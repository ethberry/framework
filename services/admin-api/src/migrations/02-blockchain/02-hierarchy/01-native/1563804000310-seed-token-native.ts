import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedTokenNativeAt1563804000310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
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
        11010101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        110101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11020101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        110201,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        21010101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        210101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        31010101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        310101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        41010101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        410101,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
