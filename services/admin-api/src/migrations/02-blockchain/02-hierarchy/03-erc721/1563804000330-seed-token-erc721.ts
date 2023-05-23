import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { imageUrl, ns } from "@framework/constants";
import { TokenMetadata } from "@framework/types";

export class SeedTokenErc721At1563804000330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const now = new Date();

    await queryRunner.query(`
      INSERT INTO ${ns}.token (
        id,
        metadata,
        image_url,
        royalty,
        token_id,
        token_status,
        template_id,
        created_at,
        updated_at
      ) VALUES (
        13010101, -- Ruby
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "130101",
        })}',
        null,
        100,
        '13010101',
        'MINTED',
        130101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        13010201, -- Emerald
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "130102",
        })}',
        null,
        100,
        '13010201',
        'MINTED',
        130102,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        13010301, -- Sapphire
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "130103",
        })}',
        null,
        100,
        '13010301',
        'MINTED',
        130103,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        13050101, -- Cuirass
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "130501",
          [TokenMetadata.GRADE]: "1",
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
          [TokenMetadata.TEMPLATE_ID]: "130502",
          [TokenMetadata.GRADE]: "5",
        })}',
        null,
        100,
        '13050201',
        'MINTED',
        130502,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        13050301, -- Cuisses
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "130503",
          [TokenMetadata.GRADE]: "10",
        })}',
        null,
        100,
        '13050301',
        'MINTED',
        130503,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        13050401, -- Gauntlets
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "130504",
          [TokenMetadata.GRADE]: "10",
        })}',
        null,
        100,
        '13050401',
        'MINTED',
        130504,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        13050501, -- Sabatons
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "130505",
          [TokenMetadata.GRADE]: "10",
        })}',
        null,
        100,
        '13050501',
        'MINTED',
        130505,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        13050601, -- Shield
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "130506",
          [TokenMetadata.GRADE]: "10",
        })}',
        null,
        100,
        '13050601',
        'MINTED',
        130506,
        '${subDays(now, 6).toISOString()}',
        '${currentDateTime}'
      ), (
        13060101, -- Sword
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "130601",
          [TokenMetadata.GRADE]: "1",
          [TokenMetadata.RARITY]: "2", // TokenRarity.RARE
        })}',
        null,
        100,
        '13060101',
        'MINTED',
        130601,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
         13060102, -- Sword
         '${JSON.stringify({
           [TokenMetadata.TEMPLATE_ID]: "130601",
           [TokenMetadata.GRADE]: "10",
           [TokenMetadata.RARITY]: "4", // TokenRarity.LEGENDARY
         })}',
         null,
         100,
         '13060102',
         'BURNED',
         130601,
         '${subDays(now, 4).toISOString()}',
         '${currentDateTime}'
      ), (
        13060201, -- Mace
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "130602",
          [TokenMetadata.GRADE]: "5",
          [TokenMetadata.RARITY]: "2", // TokenRarity.RARE
        })}',
        null,
        100,
        '13060201',
        'MINTED',
        130602,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        13060301, -- Axe
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "130603",
          [TokenMetadata.GRADE]: "10",
          [TokenMetadata.RARITY]: "4", // TokenRarity.LEGENDARY
        })}',
        null,
        100,
        '13060301',
        'MINTED',
        130603,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        13060401, -- Bow
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "130604",
          [TokenMetadata.GRADE]: "10",
          [TokenMetadata.RARITY]: "4", // TokenRarity.LEGENDARY
        })}',
        null,
        100,
        '13060401',
        'MINTED',
        130604,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        13060501, -- Staff
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "130605",
          [TokenMetadata.GRADE]: "10",
          [TokenMetadata.RARITY]: "4", // TokenRarity.LEGENDARY
        })}',
        null,
        100,
        '13060501',
        'MINTED',
        130605,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        13070101, -- Axie
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "130701",
          [TokenMetadata.GENES]: "1461501638011467653471668687260973553737594307584", // 1,2,18,128,256,1024
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
          [TokenMetadata.TEMPLATE_ID]: "130701",
          [TokenMetadata.GENES]: "1461501638011467653471668687260973553737594307584", // 1,2,18,128,256,1024
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
          [TokenMetadata.TEMPLATE_ID]: "130701",
          [TokenMetadata.GENES]: "26959946679704843266901878252702677173524145942006256923769273582592", // 1,2,18,128,256,1024
        })}',
        '${imageUrl}',
        100,
        '13070103',
        'MINTED',
        130701,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        13080101, -- Medal
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "130801",
        })}',
        null,
        100,
        '13080101',
        'MINTED',
        130801,
        '${subDays(now, 0).toISOString()}',
        '${currentDateTime}'
      ), (
        13090101, -- Horse
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "130901",
        })}',
        null,
        100,
        '13090101',
        'MINTED',
        130901,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        13090201,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "130902",
        })}',
        null,
        100,
        '13090201',
        'MINTED',
        130902,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        23010101, -- bep
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "230101",
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
