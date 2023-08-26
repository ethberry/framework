import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedStakingRulesNativeAt1654751224210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        81111
      ), (
        81112
      ), (
        81121
      ), (
        81122
      ), (
        81131
      ), (
        81132
      ), (
        81141
      ), (
        81142
      ), (
        81151
      ), (
        81152
      ), (
        81199
      ), (
        82111
      ), (
        82112
      ), (
        83111
      ), (
        83112
      ), (
        84111
      ), (
        84112
      ), (
        85111
      ), (
        85112
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
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        81111
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        81112
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        81121
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        81122
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        81131
      ), (
        'ERC721',
        10306,
        1030601, -- sword
        1,
        81132
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        81141
      ), (
        'ERC998',
        10406,
        1040601, -- warrior
        1,
        81142
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        81151
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        10,
        81152
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        81199
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        82111
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        82112
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        83111
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        83112
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        84111
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        84112
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        85111
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        85112
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
        111,
        'NATIVE > NATIVE',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81111,
        81112,
        'ACTIVE',
        12501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        112,
        'NATIVE > ERC20',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81121,
        81122,
        'ACTIVE',
        12501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        113,
        'NATIVE > ERC721',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81131,
        81132,
        'ACTIVE',
        12501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        114,
        'NATIVE > ERC998',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81141,
        81142,
        'ACTIVE',
        12501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        115,
        'NATIVE > ERC1155',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81151,
        81152,
        'ACTIVE',
        12501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        119,
        'NATIVE > NONE',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81199,
        null,
        'ACTIVE',
        12501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        211,
        'NATIVE > NATIVE (new)',
        '${simpleFormatting}',
        604800,
        1,
        false,
        82111,
        82112,
        'INACTIVE',
        12502,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        311,
        'NATIVE > NATIVE (inactive)',
        '${simpleFormatting}',
        604800,
        1,
        false,
        83111,
        83112,
        'INACTIVE',
        12503,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        411,
        'NATIVE > NATIVE (BEP)',
        '${simpleFormatting}',
        604800,
        1,
        false,
        84111,
        84112,
        'INACTIVE',
        12504,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        511,
        'NATIVE > NATIVE (2)',
        '${simpleFormatting}',
        604800,
        1,
        false,
        85111,
        85112,
        'ACTIVE',
        12505,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.staking_rules`);
  }
}
