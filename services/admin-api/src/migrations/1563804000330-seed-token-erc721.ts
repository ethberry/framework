import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { TokenAttributes } from "@framework/types";

export class SeedTokenErc721At1563804000330 implements MigrationInterface {
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
        13101,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "13101",
          [TokenAttributes.RARITY]: "2", // TokenRarity.RARE
        })}',
        100,
        '1',
        'MINTED',
        13101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13102,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "13102",
          [TokenAttributes.RARITY]: "2", // TokenRarity.RARE
        })}',
        100,
        '2',
        'MINTED',
        13102,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13103,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "13103",
          [TokenAttributes.RARITY]: "4", // TokenRarity.LEGENDARY
        })}',
        100,
        '3',
        'MINTED',
        13103,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13201,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "13201",
        })}',
        100,
        '1',
        'MINTED',
        13201,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13202,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "13202",
        })}',
        100,
        '2',
        'MINTED',
        13202,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13203,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "13203",
        })}',
        100,
        '3',
        'MINTED',
        13203,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.token_id_seq', 13203, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
