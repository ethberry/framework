import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedStakingRulesMysteryboxAt1654751224260 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        81611
      ), (
        81612
      ), (
        81621
      ), (
        81622
      ), (
        81631
      ), (
        81632
      ), (
        81641
      ), (
        81642
      ), (
        81651
      ), (
        81652
      ), (
        81699
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'NATIVE',
        10101,
        1010101, -- BESU
        '${WeiPerEther.toString()}',
        81611
      ), (
        'ERC721',
        11101,
        1110101, -- Sword MysteryBox
        1,
        81612
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        81621
      ), (
        'ERC721',
        11101,
        1110101, -- Sword MysteryBox
        1,
        81622
      ), (
        'ERC721',
        10306,
        1030601, -- Sword
        1,
        81631
      ), (
        'ERC721',
        11101,
        1110101, -- Sword MysteryBox
        1,
        81632
      ), (
        'ERC998',
        10406,
        1040601, -- Warrior
        1,
        81641
      ), (
        'ERC721',
        11101,
        1110101, -- Sword MysteryBox
        1,
        81642
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        81651
      ), (
        'ERC721',
        11101,
        1110101, -- Sword MysteryBox
        1,
        81652
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.staking_rules (
        id,
        title,
        image_url,
        description,
        duration_amount,
        penalty,
        recurrent,
        deposit_id,
        reward_id,
        staking_rule_status,
        external_id,
        contract_id,                               
        created_at,
        updated_at
      ) VALUES (
        116,
        'NATIVE > MYSTERYBOX',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81611,
        81612,
        'ACTIVE',
        116,
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        126,
        'ERC20 > MYSTERYBOX',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81621,
        81622,
        'ACTIVE',
        126,
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        136,
        'ERC721 > MYSTERYBOX',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81631,
        81632,
        'ACTIVE',
        136,
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        146,
        'ERC998 > MYSTERYBOX',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81641,
        81642,
        'ACTIVE',
        146,
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        156,
        'ERC1155 > MYSTERYBOX',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81651,
        81652,
        'ACTIVE',
        156,
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.staking_rules`);
  }
}
