import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedStakingRulesErc1155At1654751224250 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        80511
      ), (
        80512
      ), (
        80521
      ), (
        80522
      ), (
        80531
      ), (
        80532
      ), (
        80541
      ), (
        80542
      ), (
        80551
      ), (
        80552
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
        'ERC1155',
        1501,
        150101, -- gold
        1000,
        80511
      ), (
        'NATIVE',
        1101,
        110101, -- ETH
        '${constants.WeiPerEther.toString()}',
        80512
      ), (
        'ERC1155',
        1501,
        150101, -- gold
        1000,
        80521
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        80522
      ), (
        'ERC1155',
        1501,
        150101, -- gold
        1000,
        80531
      ), (
        'ERC721',
        1306,
        130601, -- sword
        1,
        80532
      ), (
        'ERC1155',
        1501,
        150101, -- gold
        1000,
        80541
      ), (
        'ERC998',
        1406,
        140601, -- warrior
        1,
        80542
      ), (
        'ERC1155',
        1501,
        150101, -- gold
        1000,
        80551
      ), (
        'ERC1155',
        1501,
        150101, -- gold
        1000,
        80552
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.staking_rules (
        title,
        description,
        duration_amount,
        penalty,
        recurrent,
        deposit_id,
        reward_id,
        external_id,
        staking_rule_status,
        created_at,
        updated_at
      ) VALUES (
        'ERC1155 > NATIVE',
        '${simpleFormatting}',
        2592000,
        1,
        false,
        80511,
        80512,
        51,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'ERC1155 > ERC20',
        '${simpleFormatting}',
        2592000,
        1,
        false,
        80521,
        80522,
        52,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'ERC1155 > ERC721',
        '${simpleFormatting}',
        2592000,
        1,
        false,
        80531,
        80532,
        53,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'ERC1155 > ERC998',
        '${simpleFormatting}',
        2592000,
        1,
        false,
        80541,
        80542,
        54,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'ERC1155 > ERC1155',
        '${simpleFormatting}',
        2592000,
        1,
        false,
        80551,
        80552,
        55,
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
