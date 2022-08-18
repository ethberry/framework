import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { TokenAttributes } from "@framework/types";

export class SeedTokenMysteryboxAt1563804000360 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.token (
        id,
        attributes,
        royalty,
        token_id,
        token_status,
        template_id,
        created_at,
        updated_at
      ) VALUES (
        601001,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "601001",
        })}',
        100,
        '1',
        'MINTED',
        601001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        604001,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "604001",
        })}',
        100,
        '1',
        'MINTED',
        604001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        605001,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "605001",
        })}',
        100,
        '1',
        'MINTED',
        605001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        606001,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "606001",
        })}',
        100,
        '1',
        'MINTED',
        606001,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.token_id_seq', 606001, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
