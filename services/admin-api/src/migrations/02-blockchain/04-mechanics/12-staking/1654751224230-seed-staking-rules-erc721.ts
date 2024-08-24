import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedStakingRulesErc721At1654751224230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        81311
      ), (
        81312
      ), (
        81321
      ), (
        81322
      ), (
        81331
      ), (
        81332
      ), (
        81341
      ), (
        81342
      ), (
        81351
      ), (
        81352
      ), (
        81399
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
        'ERC721',
        10306,
        1030601, -- Sword
        1,
        81311
      ), (
        'NATIVE',
        10101,
        1010101, -- BESU
        '${WeiPerEther.toString()}',
        81312
      ), (
        'ERC721',
        10306,
        1030601, -- Sword
        1,
        81321
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        81322
      ), (
        'ERC721',
        10306,
        1030601, -- Sword
        1,
        81331
      ), (
        'ERC721',
        10306,
        1030601, -- Sword
        1,
        81332
      ), (
        'ERC721',
        10306,
        1030601, -- Sword
        1,
        81341
      ), (
        'ERC998',
        10406,
        1040601, -- Warrior
        1,
        81342
      ), (
        'ERC721',
        10306,
        1030601, -- Sword
        1,
        81351
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        81352
      ), (
        'ERC721',
        10306,
        1030601, -- Sword
        1,
        81399
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
        131,
        'ERC721 > NATIVE',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81311,
        81312,
        'ACTIVE',
        131,
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        132,
        'ERC721 > ERC20',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81321,
        81322,
        'ACTIVE',
        132,
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        133,
        'ERC721 > ERC721',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81331,
        81332,
        'ACTIVE',
        133,
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        134,
        'ERC721 > ERC998',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81341,
        81342,
        'ACTIVE',
        134,
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        135,
        'ERC721 > ERC1155',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81351,
        81352,
        'ACTIVE',
        135,
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        139,
        'ERC721 > NONE',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81399,
        null,
        'ACTIVE',
        139,
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
