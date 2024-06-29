import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedStakingRulesErc20At1654751224220 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        81211
      ), (
        81212
      ), (
        81221
      ), (
        81222
      ), (
        81231
      ), (
        81232
      ), (
        81241
      ), (
        81242
      ), (
        81251
      ), (
        81252
      ), (
        81299
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
        81211
      ), (
        'NATIVE',
        10101,
        1010101, -- BESU
        '${WeiPerEther.toString()}',
        81212
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        81221
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        81222
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        81231
      ), (
        'ERC721',
        10301,
        1030101, -- Ruby
        1,
        81232
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        81241
      ), (
        'ERC998',
        10406,
        1040601, -- Warrior
        1,
        81242
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        81251
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        81252
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        81299
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
        121,
        'ERC20 > NATIVE',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81211,
        81212,
        'ACTIVE',
        121,
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        122,
        'ERC20 > ERC20',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81221,
        81222,
        'ACTIVE',
        122,
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        123,
        'ERC20 > ERC721',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81231,
        81232,
        'ACTIVE',
        123,
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        124,
        'ERC20 > ERC998',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81241,
        81242,
        'ACTIVE',
        124,
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        125,
        'ERC20 > ERC1155',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81251,
        81252,
        'ACTIVE',
        125,
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        129,
        'ERC20 > NONE',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81299,
        null,
        'ACTIVE',
        129,
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
