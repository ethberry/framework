import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedStakingRulesErc20At1654751224220 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
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
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        80211
      ), (
        'NATIVE',
        1101,
        110101, -- ETH
        '${constants.WeiPerEther.toString()}',
        80212
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        80221
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        80222
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        80231
      ), (
        'ERC721',
        1301,
        130101, -- rune
        '${constants.WeiPerEther.toString()}',
        80232
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        80241
      ), (
        'ERC998',
        1406,
        140601, -- warrior
        1,
        80242
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        80251
      ), (
        'ERC1155',
        1501,
        150101, -- gold
        1000,
        80252
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
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
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.staking_rules`);
  }
}
