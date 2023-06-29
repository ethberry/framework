import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedStakingRulesErc1155At1654751224250 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

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
      ), (
        80599
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
        10501,
        1050101, -- Gold
        1000,
        80511
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        80512
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        80521
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        80522
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        80531
      ), (
        'ERC721',
        10306,
        1030601, -- sword
        1,
        80532
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        80541
      ), (
        'ERC998',
        10406,
        1040601, -- warrior
        1,
        80542
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        80551
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        80552
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        80599
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
        51,
        'ERC1155 > NATIVE',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80511,
        80512,
        'ACTIVE',
        3,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        52,
        'ERC1155 > ERC20',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80521,
        80522,
        'ACTIVE',
        3,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        53,
        'ERC1155 > ERC721',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80531,
        80532,
        'ACTIVE',
        3,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        54,
        'ERC1155 > ERC998',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80541,
        80542,
        'ACTIVE',
        3,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        55,
        'ERC1155 > ERC1155',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80551,
        80552,
        'ACTIVE',
        3,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        59,
        'ERC1155 > NONE',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80599,
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
