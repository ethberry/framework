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
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 80252, true);`);

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
        1306,
        130601, -- sword
        1,
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
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.staking_rules (
        title,
        description,
        duration,
        penalty,
        recurrent,
        deposit_id,
        reward_id,
        external_id,
        staking_rule_status,
        created_at,
        updated_at
      ) VALUES (
        'ERC20 > NATIVE',
        '${simpleFormatting}',
        30,
        1,
        false,
        80211,
        80212,
        21,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'ERC20 > ERC20',
        '${simpleFormatting}',
        30,
        1,
        false,
        80221,
        80222,
        22,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'ERC20 > ERC721',
        '${simpleFormatting}',
        30,
        1,
        false,
        80231,
        80232,
        23,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'ERC20 > ERC998',
        '${simpleFormatting}',
        30,
        1,
        false,
        80241,
        80242,
        24,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'ERC20 > ERC1155',
        '${simpleFormatting}',
        30,
        1,
        false,
        80251,
        80252,
        25,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.staking_rules`);
  }
}
