import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

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
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 80452, true);`);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC998',
        406,
        406001, -- warrior
        1,
        80411
      ), (
        'NATIVE',
        101,
        101001, -- ETH
        '${constants.WeiPerEther.toString()}',
        80412
      ), (
        'ERC998',
        406,
        406001, -- warrior
        1,
        80421
      ), (
        'ERC20',
        201,
        201001, -- space credit
        '${constants.WeiPerEther.toString()}',
        80422
      ), (
        'ERC998',
        406,
        406001, -- warrior
        1,
        80431
      ), (
        'ERC721',
        306,
        306001, -- sword
        1,
        80432
      ), (
        'ERC998',
        406,
        406001, -- warrior
        1,
        80441
      ), (
        'ERC998',
        406,
        406001, -- warrior
        1,
        80442
      ), (
        'ERC998',
        406,
        406001, -- warrior
        1,
        80451
      ), (
        'ERC1155',
        501,
        501001, -- gold
        1000,
        80452
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
        'ERC998 > NATIVE',
        '${simpleFormatting}',
        30,
        1,
        false,
        80411,
        80412,
        41,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'ERC998 > ERC20',
        '${simpleFormatting}',
        30,
        1,
        false,
        80421,
        80422,
        42,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'ERC998 > ERC721',
        '${simpleFormatting}',
        30,
        1,
        false,
        80431,
        80432,
        43,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'ERC998 > ERC998',
        '${simpleFormatting}',
        30,
        1,
        false,
        80441,
        80442,
        44,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'ERC998 > ERC1155',
        '${simpleFormatting}',
        1,
        1,
        true,
        80451,
        80452,
        45,
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
