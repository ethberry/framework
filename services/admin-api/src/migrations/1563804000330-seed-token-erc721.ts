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
        })}',
        100,
        '1',
        'MINTED',
        13102,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13103,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "13103",
        })}',
        100,
        '1',
        'MINTED',
        13103,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13501,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "13601",
          [TokenAttributes.GRADE]: "1",
        })}',
        100,
        '1',
        'MINTED',
        13501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13502,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "13502",
          [TokenAttributes.GRADE]: "5",
        })}',
        100,
        '2',
        'MINTED',
        13502,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13503,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "13503",
          [TokenAttributes.GRADE]: "10",
        })}',
        100,
        '3',
        'MINTED',
        13503,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13601,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "13601",
          [TokenAttributes.GRADE]: "1",
          [TokenAttributes.RARITY]: "2", // TokenRarity.RARE
        })}',
        100,
        '1',
        'MINTED',
        13601,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13602,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "13602",
          [TokenAttributes.GRADE]: "5",
          [TokenAttributes.RARITY]: "2", // TokenRarity.RARE
        })}',
        100,
        '2',
        'MINTED',
        13602,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13603,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "13603",
          [TokenAttributes.GRADE]: "10",
          [TokenAttributes.RARITY]: "4", // TokenRarity.LEGENDARY
        })}',
        100,
        '3',
        'MINTED',
        13603,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13701,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "13701",
        })}',
        100,
        '1',
        'MINTED',
        13701,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.token_id_seq', 13603, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
