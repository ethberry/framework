import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { TokenAttributes } from "@framework/types";

export class SeedTokenErc998At1563804000340 implements MigrationInterface {
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
        406001,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "406001",
          [TokenAttributes.GRADE]: "1",
          [TokenAttributes.RARITY]: "0", // TokenRarity.COMMON
        })}',
        100,
        '1',
        'MINTED',
        406001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        406002,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "406002",
          [TokenAttributes.GRADE]: "5",
          [TokenAttributes.RARITY]: "1", // TokenRarity.UNCOMMON
        })}',
        100,
        '2',
        'MINTED',
        406002,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        406003,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "406003",
          [TokenAttributes.GRADE]: "10",
          [TokenAttributes.RARITY]: "2", // TokenRarity.RARE
        })}',
        100,
        '3',
        'MINTED',
        406003,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        406004,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "406001",
          [TokenAttributes.GRADE]: "10",
          [TokenAttributes.RARITY]: "2", // TokenRarity.RARE
        })}',
        100,
        '3',
        'BURNED',
        406001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        411001,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "411001",
          [TokenAttributes.GRADE]: "10",
          [TokenAttributes.RARITY]: "2", // TokenRarity.RARE
        })}',
        100,
        '3',
        'MINTED',
        411001,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.token_id_seq', 411001, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
