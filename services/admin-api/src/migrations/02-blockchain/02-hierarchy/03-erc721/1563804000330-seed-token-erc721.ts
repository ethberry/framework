import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { NodeEnv } from "@gemunion/constants";
import { imageUrl, ns } from "@framework/constants";
import { TokenMetadata } from "@framework/types";

export class SeedTokenErc721At1563804000330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

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
        103010101, -- Ruby
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030101",
        })}',
        null,
        100,
        '103010101',
        'MINTED',
        1030101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        103010201, -- Emerald
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030102",
        })}',
        null,
        100,
        '103010201',
        'MINTED',
        1030102,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        103010301, -- Sapphire
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030103",
        })}',
        null,
        100,
        '103010301',
        'MINTED',
        1030103,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        103050101, -- Cuirass
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030501",
          [TokenMetadata.LEVEL]: "1",
        })}',
        null,
        100,
        '103050101',
        'MINTED',
        1030501,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        103050201, -- Helmet
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030502",
          [TokenMetadata.LEVEL]: "5",
        })}',
        null,
        100,
        '103050201',
        'MINTED',
        1030502,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        103050301, -- Cuisses
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030503",
          [TokenMetadata.LEVEL]: "10",
        })}',
        null,
        100,
        '103050301',
        'MINTED',
        1030503,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        103050401, -- Gauntlets
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030504",
          [TokenMetadata.LEVEL]: "10",
        })}',
        null,
        100,
        '103050401',
        'MINTED',
        1030504,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        103050501, -- Sabatons
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030505",
          [TokenMetadata.LEVEL]: "10",
        })}',
        null,
        100,
        '103050501',
        'MINTED',
        1030505,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        103050601, -- Round Shield
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030506",
          [TokenMetadata.LEVEL]: "10",
        })}',
        null,
        100,
        '103050601',
        'MINTED',
        1030506,
        '${subDays(now, 6).toISOString()}',
        '${currentDateTime}'
      ), (
        103050701, -- Heater Shield
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030507",
          [TokenMetadata.LEVEL]: "10",
        })}',
        null,
        100,
        '103050701',
        'MINTED',
        1030507,
        '${subDays(now, 6).toISOString()}',
        '${currentDateTime}'
      ), (
        103050801, -- Royal Shield
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030508",
          [TokenMetadata.LEVEL]: "10",
        })}',
        null,
        100,
        '103050801',
        'MINTED',
        1030508,
        '${subDays(now, 6).toISOString()}',
        '${currentDateTime}'
      ), (
        103050901, -- Cloak
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030509",
          [TokenMetadata.LEVEL]: "4",
        })}',
        null,
        100,
        '103050901',
        'MINTED',
        1030509,
        '${subDays(now, 6).toISOString()}',
        '${currentDateTime}'
      ), (
        103051001, -- Robe
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030510",
          [TokenMetadata.LEVEL]: "1",
        })}',
        null,
        100,
        '103051001',
        'MINTED',
        1030510,
        '${subDays(now, 6).toISOString()}',
        '${currentDateTime}'
      ), (
        103051101, -- Mage''s Hat
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030511",
        })}',
        null,
        100,
        '103051101',
        'MINTED',
        1030511,
        '${subDays(now, 6).toISOString()}',
        '${currentDateTime}'
      ), (
        103051201, -- Witch''s Hat
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030512",
        })}',
        null,
        100,
        '103051201',
        'MINTED',
        1030512,
        '${subDays(now, 6).toISOString()}',
        '${currentDateTime}'
      ), (
        103051301, -- Viking''s Helmet
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030513",
        })}',
        null,
        100,
        '103051301',
        'MINTED',
        1030513,
        '${subDays(now, 6).toISOString()}',
        '${currentDateTime}'
      ), (
        103060101, -- Sword #1
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030601",
          [TokenMetadata.LEVEL]: "1",
          [TokenMetadata.RARITY]: "0", // TokenRarity.COMMON
        })}',
        null,
        100,
        '103060101',
        'MINTED',
        1030601,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
         103060102, -- Sword #2
         '${JSON.stringify({
           [TokenMetadata.TEMPLATE_ID]: "1030601",
           [TokenMetadata.LEVEL]: "10",
           [TokenMetadata.RARITY]: "0", // TokenRarity.COMMON
         })}',
         null,
         100,
         '103060102',
         'MINTED',
         1030601,
         '${subDays(now, 4).toISOString()}',
         '${currentDateTime}'
      ), (
         103060103, -- Sword #3
         '${JSON.stringify({
           [TokenMetadata.TEMPLATE_ID]: "1030601",
           [TokenMetadata.LEVEL]: "3",
           [TokenMetadata.RARITY]: "0", // TokenRarity.COMMON
         })}',
         null,
         100,
         '103060103',
         'MINTED',
         1030601,
         '${subDays(now, 4).toISOString()}',
         '${currentDateTime}'
      ), (
        103060201, -- Mace
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030602",
          [TokenMetadata.LEVEL]: "5",
          [TokenMetadata.RARITY]: "2", // TokenRarity.RARE
        })}',
        null,
        100,
        '103060201',
        'MINTED',
        1030602,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        103060301, -- Axe
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030603",
          [TokenMetadata.LEVEL]: "10",
          [TokenMetadata.RARITY]: "2", // TokenRarity.RARE
        })}',
        null,
        100,
        '103060301',
        'BURNED',
        1030603,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        103060401, -- Bow
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030604",
          [TokenMetadata.LEVEL]: "10",
          [TokenMetadata.RARITY]: "3", // TokenRarity.EPIC
        })}',
        null,
        100,
        '103060401',
        'MINTED',
        1030604,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        103060501, -- Staff
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030605",
          [TokenMetadata.LEVEL]: "10",
          [TokenMetadata.RARITY]: "3", // TokenRarity.EPIC
        })}',
        null,
        100,
        '103060501',
        'MINTED',
        1030605,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        103061001, -- Mjölnir
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030610",
          [TokenMetadata.LEVEL]: "10",
          [TokenMetadata.RARITY]: "4", // TokenRarity.LEGENDARY
        })}',
        null,
        100,
        '103061001',
        'MINTED',
        1030610,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        103070101, -- Axie
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030701",
          [TokenMetadata.GENES]: "1461501638011467653471668687260973553737594307584", // 1,2,18,128,256,1024
        })}',
        '${imageUrl}',
        100,
        '103070101',
        'MINTED',
        1030701,
        '${subDays(now, 0).toISOString()}',
        '${currentDateTime}'
      ), (
        103070102,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030701",
          [TokenMetadata.GENES]: "1461501638011467653471668687260973553737594307584", // 1,2,18,128,256,1024
        })}',
        '${imageUrl}',
        100,
        '103070102',
        'MINTED',
        1030701,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        103070103,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030701",
          [TokenMetadata.GENES]: "26959946679704843266901878252702677173524145942006256923769273582592", // 1,2,18,128,256,1024
        })}',
        '${imageUrl}',
        100,
        '103070103',
        'MINTED',
        1030701,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        103080101, -- Medal
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030801",
        })}',
        null,
        100,
        '103080101',
        'MINTED',
        1030801,
        '${subDays(now, 0).toISOString()}',
        '${currentDateTime}'
      ), (
        103090101, -- Horse
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030901",
        })}',
        null,
        100,
        '103090101',
        'MINTED',
        1030901,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        103090201,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1030902",
        })}',
        null,
        100,
        '103090201',
        'MINTED',
        1030902,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        103800101, -- Cuisses
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1038001",
          [TokenMetadata.LEVEL]: "7",
        })}',
        null,
        100,
        '103800101',
        'MINTED',
        1038001,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        203010101, -- bep
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "2030101",
        })}',
        null,
        100,
        '203010101',
        'MINTED',
        2030101,
        '${subDays(now, 30).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
