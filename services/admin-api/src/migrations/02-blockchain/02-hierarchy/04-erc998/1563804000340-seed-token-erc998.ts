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
        14050101, -- Scroll
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "140501",
          [TokenAttributes.GRADE]: "1",
        })}',
        100,
        '1',
        'MINTED',
        140501,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        14050201,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "140502",
          [TokenAttributes.GRADE]: "10",
        })}',
        100,
        '2',
        'MINTED',
        140502,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        14060101, -- hero
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "140601",
          [TokenAttributes.GRADE]: "1",
          [TokenAttributes.RARITY]: "0", // TokenRarity.COMMON
        })}',
        100,
        '1',
        'MINTED',
        140601,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
         14060102,
         '${JSON.stringify({
           [TokenAttributes.TEMPLATE_ID]: "40601",
           [TokenAttributes.GRADE]: "10",
           [TokenAttributes.RARITY]: "2", // TokenRarity.RARE
         })}',
         100,
         '3',
         'BURNED',
         140601,
         '${subDays(now, 1).toISOString()}',
         '${currentDateTime}'
      ), (
        14060201,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "140602",
          [TokenAttributes.GRADE]: "5",
          [TokenAttributes.RARITY]: "1", // TokenRarity.UNCOMMON
        })}',
        100,
        '2',
        'MINTED',
        140602,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        14060301,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "140603",
          [TokenAttributes.GRADE]: "10",
          [TokenAttributes.RARITY]: "2", // TokenRarity.RARE
        })}',
        100,
        '3',
        'MINTED',
        140603,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        14070101,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "140701",
          [TokenAttributes.GRADE]: "10",
          [TokenAttributes.RARITY]: "2", // TokenRarity.RARE
          [TokenAttributes.GENES]: "1461501638011467653471668687260973553737594307584", // 1,2,18,128,256,1024
        })}',
        100,
        '1',
        'MINTED',
        140701,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        14090101,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "140901",
        })}',
        100,
        '1',
        'MINTED',
        140901,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        14110101,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "141101",
        })}',
        100,
        '1',
        'MINTED',
        141101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        14120101,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "141201",
        })}',
        100,
        '1',
        'MINTED',
        141201,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        14130101,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "141301",
        })}',
        100,
        '1',
        'MINTED',
        141301,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        24010101,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "240101",
          [TokenAttributes.GRADE]: "10",
          [TokenAttributes.RARITY]: "2", // TokenRarity.RARE
        })}',
        100,
        '3',
        'MINTED',
        240101,
        '${subDays(now, 30).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
