import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@ethberry/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";
import { NodeEnv } from "@ethberry/constants";

export class SeedStakingRulesNativeAt1654751224210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
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
        81111
      ), (
        'NATIVE',
        10101,
        1010101, -- BESU
        '${WeiPerEther.toString()}',
        81112
      ), (
        'NATIVE',
        10101,
        1010101, -- BESU
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
        1010101, -- BESU
        '${WeiPerEther.toString()}',
        81131
      ), (
        'ERC721',
        10306,
        1030601, -- Sword
        1,
        81132
      ), (
        'NATIVE',
        10101,
        1010101, -- BESU
        '${WeiPerEther.toString()}',
        81141
      ), (
        'ERC998',
        10406,
        1040601, -- Warrior
        1,
        81142
      ), (
        'NATIVE',
        10101,
        1010101, -- BESU
        '${WeiPerEther.toString()}',
        81151
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        81152
      ), (
        'NATIVE',
        10101,
        1010101, -- BESU
        '${WeiPerEther.toString()}',
        81199
      ), (
        'NATIVE',
        10101,
        1010101, -- BESU
        '${WeiPerEther.toString()}',
        82111
      ), (
        'NATIVE',
        10101,
        1010101, -- BESU
        '${WeiPerEther.toString()}',
        82112
      ), (
        'NATIVE',
        10101,
        1010101, -- BESU
        '${WeiPerEther.toString()}',
        83111
      ), (
        'NATIVE',
        10101,
        1010101, -- BESU
        '${WeiPerEther.toString()}',
        83112
      ), (
        'NATIVE',
        10101,
        1010101, -- BESU
        '${WeiPerEther.toString()}',
        84111
      ), (
        'NATIVE',
        10101,
        1010101, -- BESU
        '${WeiPerEther.toString()}',
        84112
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
        111,
        'NATIVE > NATIVE',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81111,
        81112,
        'ACTIVE',
        111,
        12501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        112,
        'NATIVE > ERC20',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81121,
        81122,
        'ACTIVE',
        112,
        12501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        113,
        'NATIVE > ERC721',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81131,
        81132,
        'ACTIVE',
        113,
        12501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        114,
        'NATIVE > ERC998',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81141,
        81142,
        'ACTIVE',
        114,
        12501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        115,
        'NATIVE > ERC1155',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81151,
        81152,
        'ACTIVE',
        115,
        12501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        119,
        'NATIVE > NONE',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81199,
        null,
        'ACTIVE',
        119,
        12501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        211,
        'NATIVE > NATIVE (new)',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        82111,
        82112,
        'NEW',
        211,
        12502,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        311,
        'NATIVE > NATIVE (inactive)',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        83111,
        83112,
        'INACTIVE',
        311,
        12503,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        411,
        'NATIVE > NATIVE (BEP)',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        84111,
        84112,
        'INACTIVE',
        411,
        12504,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.staking_rules`);
  }
}
