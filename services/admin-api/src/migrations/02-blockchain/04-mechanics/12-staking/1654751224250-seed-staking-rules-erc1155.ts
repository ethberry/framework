import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedStakingRulesErc1155At1654751224250 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        81511
      ), (
        81512
      ), (
        81521
      ), (
        81522
      ), (
        81531
      ), (
        81532
      ), (
        81541
      ), (
        81542
      ), (
        81551
      ), (
        81552
      ), (
        81599
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
        81511
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        81512
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        81521
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        81522
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        81531
      ), (
        'ERC721',
        10306,
        1030601, -- sword
        1,
        81532
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        81541
      ), (
        'ERC998',
        10406,
        1040601, -- warrior
        1,
        81542
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        81551
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        81552
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        81599
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
        151,
        'ERC1155 > NATIVE',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81511,
        81512,
        'ACTIVE',
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        152,
        'ERC1155 > ERC20',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81521,
        81522,
        'ACTIVE',
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        153,
        'ERC1155 > ERC721',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81531,
        81532,
        'ACTIVE',
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        154,
        'ERC1155 > ERC998',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81541,
        81542,
        'ACTIVE',
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        155,
        'ERC1155 > ERC1155',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81551,
        81552,
        'ACTIVE',
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        159,
        'ERC1155 > NONE',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81599,
        null,
        'ACTIVE',
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
