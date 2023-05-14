import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { imageUrl, ns } from "@framework/constants";
import { TokenAttributes } from "@framework/types";

export class SeedTokenErc721At1563804000330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const now = new Date();

    await queryRunner.query(`
      INSERT INTO ${ns}.token (
        id,
        attributes,
        image_url,
        royalty,
        token_id,
        token_status,
        template_id,
        created_at,
        updated_at
      ) VALUES (
        13010101,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130101",
        })}',
        null,
        100,
        '13010101',
        'MINTED',
        130101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        13010102,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130101",
        })}',
        null,
        100,
        '13010102',
        'MINTED',
        130101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        13010103,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130101",
        })}',
        null,
        100,
        '13010103',
        'MINTED',
        130101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        13010104,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130101",
        })}',
        null,
        100,
        '13010104',
        'MINTED',
        130101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        13010105,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130101",
        })}',
        null,
        100,
        '13010105',
        'MINTED',
        130101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        13010106,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130101",
        })}',
        null,
        100,
        '13010106',
        'MINTED',
        130101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        13010107,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130101",
        })}',
        null,
        100,
        '13010107',
        'MINTED',
        130101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        13010108,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130101",
        })}',
        null,
        100,
        '13010108',
        'MINTED',
        130101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        13010109,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130101",
        })}',
        null,
        100,
        '13010109',
        'MINTED',
        130101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        13010110,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130101",
        })}',
        null,
        100,
        '13010110',
        'MINTED',
        130101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        13010201,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130102",
        })}',
        null,
        100,
        '13010201',
        'MINTED',
        130102,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        13010301,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130103",
        })}',
        null,
        100,
        '13010301',
        'MINTED',
        130103,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        13050101, -- Chain mail
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130501",
          [TokenAttributes.GRADE]: "1",
        })}',
        null,
        100,
        '13050101',
        'MINTED',
        130501,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        13050201, -- Helmet
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130502",
          [TokenAttributes.GRADE]: "5",
        })}',
        null,
        100,
        '13050201',
        'MINTED',
        130502,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        13050301,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130503",
          [TokenAttributes.GRADE]: "10",
        })}',
        null,
        100,
        '13050301',
        'MINTED',
        130503,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        13050401,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130504",
          [TokenAttributes.GRADE]: "10",
        })}',
        null,
        100,
        '13050401',
        'MINTED',
        130504,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        13050501,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130505",
          [TokenAttributes.GRADE]: "10",
        })}',
        null,
        100,
        '13050501',
        'MINTED',
        130505,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        13050601,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130506",
          [TokenAttributes.GRADE]: "10",
        })}',
        null,
        100,
        '13050601',
        'MINTED',
        130506,
        '${subDays(now, 6).toISOString()}',
        '${currentDateTime}'
      ), (
        13060101,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130601",
          [TokenAttributes.GRADE]: "1",
          [TokenAttributes.RARITY]: "2", // TokenRarity.RARE
        })}',
        null,
        100,
        '13060101',
        'MINTED',
        130601,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
         13060102,
         '${JSON.stringify({
           [TokenAttributes.TEMPLATE_ID]: "130601",
           [TokenAttributes.GRADE]: "10",
           [TokenAttributes.RARITY]: "4", // TokenRarity.LEGENDARY
         })}',
         null,
         100,
         '13060102',
         'BURNED',
         130601,
         '${subDays(now, 4).toISOString()}',
         '${currentDateTime}'
      ), (
        13060201,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130602",
          [TokenAttributes.GRADE]: "5",
          [TokenAttributes.RARITY]: "2", // TokenRarity.RARE
        })}',
        null,
        100,
        '13060201',
        'MINTED',
        130602,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        13060301,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130603",
          [TokenAttributes.GRADE]: "10",
          [TokenAttributes.RARITY]: "4", // TokenRarity.LEGENDARY
        })}',
        null,
        100,
        '13060301',
        'MINTED',
        130603,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        13070101,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130701",
          [TokenAttributes.GENES]: "1461501638011467653471668687260973553737594307584", // 1,2,18,128,256,1024
        })}',
        '${imageUrl}',
        100,
        '13070101',
        'MINTED',
        130701,
        '${subDays(now, 0).toISOString()}',
        '${currentDateTime}'
      ), (
        13070102,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130701",
          [TokenAttributes.GENES]: "1461501638011467653471668687260973553737594307584", // 1,2,18,128,256,1024
        })}',
        '${imageUrl}',
        100,
        '13070102',
        'MINTED',
        130701,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        13070103,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130701",
          [TokenAttributes.GENES]: "26959946679704843266901878252702677173524145942006256923769273582592", // 1,2,18,128,256,1024
        })}',
        '${imageUrl}',
        100,
        '13070103',
        'MINTED',
        130701,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        13080101,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130801",
        })}',
        null,
        100,
        '13080101',
        'MINTED',
        130801,
        '${subDays(now, 0).toISOString()}',
        '${currentDateTime}'
      ), (
        13090101,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130901",
        })}',
        null,
        100,
        '13090101',
        'MINTED',
        130901,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        13090102,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "130901",
        })}',
        null,
        100,
        '13090102',
        'MINTED',
        130901,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        23010101,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "230101",
        })}',
        null,
        100,
        '23010101',
        'MINTED',
        230101,
        '${subDays(now, 30).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
