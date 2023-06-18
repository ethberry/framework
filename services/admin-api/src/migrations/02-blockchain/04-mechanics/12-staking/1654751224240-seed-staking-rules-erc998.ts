import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedStakingRulesErc998At1654751224240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        80411
      ), (
        80412
      ), (
        80421
      ), (
        80422
      ), (
        80431
      ), (
        80432
      ), (
        80441
      ), (
        80442
      ), (
        80451
      ), (
        80452
      ), (
        80499
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
        'ERC998',
        10406,
        1040601, -- warrior
        1,
        80411
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        80412
      ), (
        'ERC998',
        10406,
        1040601, -- warrior
        1,
        80421
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        80422
      ), (
        'ERC998',
        10406,
        1040601, -- warrior
        1,
        80431
      ), (
        'ERC721',
        10306,
        1030601, -- sword
        1,
        80432
      ), (
        'ERC998',
        10406,
        1040601, -- warrior
        1,
        80441
      ), (
        'ERC998',
        10406,
        1040601, -- warrior
        1,
        80442
      ), (
        'ERC998',
        10406,
        1040601, -- warrior
        1,
        80451
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        80452
      ), (
        'ERC998',
        10406,
        1040601, -- warrior
        1,
        80499
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
        41,
        'ERC998 > NATIVE',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80411,
        80412,
        'ACTIVE',
        3,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        42,
        'ERC998 > ERC20',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80421,
        80422,
        'ACTIVE',
        3,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        43,
        'ERC998 > ERC721',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80431,
        80432,
        'ACTIVE',
        3,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        44,
        'ERC998 > ERC998',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80441,
        80442,
        'ACTIVE',
        3,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        45,
        'ERC998 > ERC1155',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80451,
        80452,
        'ACTIVE',
        3,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        49,
        'ERC998 > NONE',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80499,
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
