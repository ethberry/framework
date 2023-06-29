import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { ns } from "@framework/constants";
import { TokenMetadata } from "@framework/types";

export class SeedTokenErc998At1563804000340 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

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
        104010101, -- Physic rune
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1040101",
        })}',
        100,
        '104010101',
        'MINTED',
        1040101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        104010201, -- Magic rune
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1040101",
        })}',
        100,
        '104010201',
        'MINTED',
        1040101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        104010301, -- Poison rune
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1040101",
        })}',
        100,
        '104010301',
        'MINTED',
        1040101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        104040101, -- Fireball
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1040401",
        })}',
        100,
        '104040101',
        'MINTED',
        1040401,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        104040201, -- Frostbite
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1040402",
        })}',
        100,
        '104040201',
        'MINTED',
        1040402,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        104040301, -- Lightning bolt
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1040403",
        })}',
        100,
        '104040301',
        'MINTED',
        1040403,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        104040401, -- Slow
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1040404",
        })}',
        100,
        '104040401',
        'MINTED',
        1040404,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        104040501, -- Fly
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1040405",
        })}',
        100,
        '104040501',
        'MINTED',
        1040405,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        104050101, -- Grimoire #1
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1040501",
          [TokenMetadata.LEVEL]: "1",
        })}',
        100,
        '104050101',
        'MINTED',
        1040501,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        104050102, -- Grimoire #2
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1040501",
          [TokenMetadata.LEVEL]: "10",
        })}',
        100,
        '104050102',
        'MINTED',
        1040501,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        104050201, -- Foliant
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1040502",
          [TokenMetadata.LEVEL]: "10",
        })}',
        100,
        '104050201',
        'MINTED',
        1040501,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        104060101, -- Warrior
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1040601",
          [TokenMetadata.LEVEL]: "1",
          [TokenMetadata.RARITY]: "0", // TokenRarity.COMMON
        })}',
        100,
        '104060101',
        'MINTED',
        1040601,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
         104060102, -- Warrior
         '${JSON.stringify({
           [TokenMetadata.TEMPLATE_ID]: "40601",
           [TokenMetadata.LEVEL]: "10",
           [TokenMetadata.RARITY]: "2", // TokenRarity.RARE
         })}',
         100,
         '104060102',
         'BURNED',
         1040601,
         '${subDays(now, 1).toISOString()}',
         '${currentDateTime}'
      ), (
        104060201, -- Rouge
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1040602",
          [TokenMetadata.LEVEL]: "5",
          [TokenMetadata.RARITY]: "1", // TokenRarity.UNCOMMON
        })}',
        100,
        '104060201',
        'MINTED',
        1040602,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        104060301, -- Mage
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1040603",
          [TokenMetadata.LEVEL]: "10",
          [TokenMetadata.RARITY]: "2", // TokenRarity.RARE
        })}',
        100,
        '104060301',
        'MINTED',
        1040603,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        104070101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1040701",
          [TokenMetadata.LEVEL]: "10",
          [TokenMetadata.RARITY]: "2", // TokenRarity.RARE
          [TokenMetadata.TRAITS]: "1461501638011467653471668687260973553737594307584", // 1,2,18,128,256,1024
        })}',
        100,
        '104070101',
        'MINTED',
        1040701,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        104090101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1040901",
        })}',
        100,
        '104090101',
        'MINTED',
        1040901,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        104110101, -- erc20 owner
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1041101",
        })}',
        100,
        '14110101',
        'MINTED',
        1041101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        104120101, -- erc1155 owner
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1041201",
        })}',
        100,
        '14120101',
        'MINTED',
        1041201,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        104130101, -- erc20 + erc1155 owner
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1041301",
        })}',
        100,
        '14130101',
        'MINTED',
        1041301,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        104800101, -- Voldemort
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1048001",
          [TokenMetadata.LEVEL]: "7",
        })}',
        100,
        '104800101',
        'MINTED',
        1048001,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        204010101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "2040101",
          [TokenMetadata.LEVEL]: "10",
          [TokenMetadata.RARITY]: "2", // TokenRarity.RARE
        })}',
        100,
        '24010101',
        'MINTED',
        2040101,
        '${subDays(now, 30).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
