import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { ns } from "@framework/constants";
import { TokenAttributes } from "@framework/types";

export class SeedTokenErc998At1563804000340 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const now = new Date();

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
        '${subDays(now, 1).toISOString()}',
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
        '${subDays(now, 2).toISOString()}',
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
        '${subDays(now, 3).toISOString()}',
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
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        407001,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "407001",
          [TokenAttributes.GRADE]: "10",
          [TokenAttributes.RARITY]: "2", // TokenRarity.RARE
          [TokenAttributes.GENES]: "1461501638011467653471668687260973553737594307584", // 1,2,18,128,256,1024
        })}',
        100,
        '1',
        'MINTED',
        407001,
        '${subDays(now, 1).toISOString()}',
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
        '${subDays(now, 30).toISOString()}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.token_id_seq', 411001, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
