import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedStakingRulesErc998At1654751224240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        81411
      ), (
        81412
      ), (
        81421
      ), (
        81422
      ), (
        81431
      ), (
        81432
      ), (
        81441
      ), (
        81442
      ), (
        81451
      ), (
        81452
      ), (
        81499
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
        1040602, -- Rouge
        1,
        81411
      ), (
        'NATIVE',
        10101,
        1010101, -- BESU
        '${WeiPerEther.toString()}',
        81412
      ), (
        'ERC998',
        10406,
        1040602, -- Rouge
        1,
        81421
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        81422
      ), (
        'ERC998',
        10406,
        1040602, -- Rouge
        1,
        81431
      ), (
        'ERC721',
        10306,
        1030601, -- Sword
        1,
        81432
      ), (
        'ERC998',
        10406,
        1040602, -- Rouge
        1,
        81441
      ), (
        'ERC998',
        10406,
        1040602, -- Rouge
        1,
        81442
      ), (
        'ERC998',
        10406,
        1040602, -- Rouge
        1,
        81451
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        81452
      ), (
        'ERC998',
        10406,
        1040602, -- Rouge
        1,
        81499
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
        141,
        'ERC998 > NATIVE',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81411,
        81412,
        'ACTIVE',
        141,
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        142,
        'ERC998 > ERC20',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81421,
        81422,
        'ACTIVE',
        142,
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        143,
        'ERC998 > ERC721',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81431,
        81432,
        'ACTIVE',
        143,
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        144,
        'ERC998 > ERC998',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81441,
        81442,
        'ACTIVE',
        144,
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        145,
        'ERC998 > ERC1155',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81451,
        81452,
        'ACTIVE',
        145,
        12501,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        149,
        'ERC998 > NONE',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81499,
        null,
        'ACTIVE',
        149,
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
