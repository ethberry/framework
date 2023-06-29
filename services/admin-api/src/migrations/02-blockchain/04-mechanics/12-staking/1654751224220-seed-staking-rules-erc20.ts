import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedStakingRulesErc20At1654751224220 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        80211
      ), (
        80212
      ), (
        80221
      ), (
        80222
      ), (
        80231
      ), (
        80232
      ), (
        80241
      ), (
        80242
      ), (
        80251
      ), (
        80252
      ), (
        80299
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
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        80211
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        80212
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        80221
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        80222
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        80231
      ), (
        'ERC721',
        10301,
        1030101, -- rune
        '${WeiPerEther.toString()}',
        80232
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        80241
      ), (
        'ERC998',
        10406,
        1040601, -- warrior
        1,
        80242
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        80251
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        80252
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        80299
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.staking_rules (
        id,
        title,
        description,
        duration_amount,
        penalty,
        recurrent,
        deposit_id,
        reward_id,
        staking_rule_status,
        contract_id,                               
        created_at,
        updated_at
      ) VALUES (
        21,
        'ERC20 > NATIVE',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80211,
        80212,
        'ACTIVE',
        3,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        22,
        'ERC20 > ERC20',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80221,
        80222,
        'ACTIVE',
        3,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        23,
        'ERC20 > ERC721',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80231,
        80232,
        'ACTIVE',
        3,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        24,
        'ERC20 > ERC998',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80241,
        80242,
        'ACTIVE',
        3,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        25,
        'ERC20 > ERC1155',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80251,
        80252,
        'ACTIVE',
        3,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        29,
        'ERC20 > NONE',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80299,
        null,
        'ACTIVE',
        3,       
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.staking_rules`);
  }
}
