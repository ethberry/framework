import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { ns } from "@framework/constants";
import { TokenMetadata } from "@framework/types";

export class SeedTokenErc998At1563804000340 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const now = new Date();

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
        14010101, -- Physic rune
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "140101",
        })}',
        100,
        '14010101',
        'MINTED',
        140101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        14010102, -- Magic rune
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "140101",
        })}',
        100,
        '14010102',
        'MINTED',
        140101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        14010103, -- Poison rune
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "140101",
        })}',
        100,
        '14010103',
        'MINTED',
        140101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        14040101, -- Fireball
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "140401",
        })}',
        100,
        '14040101',
        'MINTED',
        140401,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        14040201, -- Frostbite
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "140402",
        })}',
        100,
        '14040201',
        'MINTED',
        140402,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        14040301, -- Lightbolt
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "140403",
        })}',
        100,
        '14040301',
        'MINTED',
        140403,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        14040401, -- Slow
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "140404",
        })}',
        100,
        '14040401',
        'MINTED',
        140404,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        14040501, -- Fly
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "140405",
        })}',
        100,
        '14040501',
        'MINTED',
        140405,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        14050101, -- Grimoire #1
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "140501",
          [TokenMetadata.GRADE]: "1",
        })}',
        100,
        '14050101',
        'MINTED',
        140501,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        14050102, -- Grimoire #2
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "140502",
          [TokenMetadata.GRADE]: "10",
        })}',
        100,
        '14050201',
        'MINTED',
        140501,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        14060101, -- Warrior
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "140601",
          [TokenMetadata.GRADE]: "1",
          [TokenMetadata.RARITY]: "0", // TokenRarity.COMMON
        })}',
        100,
        '14060101',
        'MINTED',
        140601,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
         14060102, -- Warrior
         '${JSON.stringify({
           [TokenMetadata.TEMPLATE_ID]: "40601",
           [TokenMetadata.GRADE]: "10",
           [TokenMetadata.RARITY]: "2", // TokenRarity.RARE
         })}',
         100,
         '14060102',
         'BURNED',
         140601,
         '${subDays(now, 1).toISOString()}',
         '${currentDateTime}'
      ), (
        14060201, -- Rouge
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "140602",
          [TokenMetadata.GRADE]: "5",
          [TokenMetadata.RARITY]: "1", // TokenRarity.UNCOMMON
        })}',
        100,
        '14060201',
        'MINTED',
        140602,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        14060301, -- Mage
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "140603",
          [TokenMetadata.GRADE]: "10",
          [TokenMetadata.RARITY]: "2", // TokenRarity.RARE
        })}',
        100,
        '14060301',
        'MINTED',
        140603,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        14070101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "140701",
          [TokenMetadata.GRADE]: "10",
          [TokenMetadata.RARITY]: "2", // TokenRarity.RARE
          [TokenMetadata.TRAITS]: "1461501638011467653471668687260973553737594307584", // 1,2,18,128,256,1024
        })}',
        100,
        '14070101',
        'MINTED',
        140701,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        14090101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "140901",
        })}',
        100,
        '14090101',
        'MINTED',
        140901,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        14110101, -- erc20 owner
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "141101",
        })}',
        100,
        '14110101',
        'MINTED',
        141101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        14120101, -- erc1155 owner
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "141201",
        })}',
        100,
        '14120101',
        'MINTED',
        141201,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        14130101, -- erc20 + erc1155 owner
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "141301",
        })}',
        100,
        '14130101',
        'MINTED',
        141301,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        24010101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "240101",
          [TokenMetadata.GRADE]: "10",
          [TokenMetadata.RARITY]: "2", // TokenRarity.RARE
        })}',
        100,
        '24010101',
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
