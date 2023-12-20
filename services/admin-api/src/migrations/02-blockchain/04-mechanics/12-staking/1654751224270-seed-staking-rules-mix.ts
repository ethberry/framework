import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedStakingRulesMixedAt1654751224270 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        81711
      ), (
        81712
      ), (
        81811
      ), (
        81812
      ), (
        81911
      ), (
        81912
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
        10108,
        1010801, -- BESU (fake)
        '${WeiPerEther.toString()}',
        81711
      ), (
        'ERC20',
        10280,
        1028001, -- Warp Credits
        '${WeiPerEther.toString()}',
        81711
      ), (
        'ERC721',
        10380,
        1038001, -- Under Armour
        1,
        81712
      ), (
        'ERC20',
        10280,
        1028001, -- Warp Credits
        '${WeiPerEther.toString()}',
        81811
      ), (
        'ERC721',
        10380,
        1038001, -- Under Armour
        1000,
        81811
      ), (
        'ERC721',
        10380,
        1038001, -- Under Armour
        10,
        81812
      ), (
        'ERC1155',
        10505,
        1050501, -- Candy
        1000,
        81911
      ), (
        'ERC1155',
        10505,
        1050501, -- Candy
        10,
        81911
      ), (
        'ERC721',
        10380,
        1038001, -- Under Armour
        100,
        81912
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
        1123,
        'NATIVE + ERC20 > ERC721',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81711,
        81712,
        'ACTIVE',
        1123,
        12505,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1233,
        'ERC20 + ERC721 > ERC721',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81811,
        81812,
        'ACTIVE',
        1233,
        12505,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1553,
        'ERC1155 + ERC1155 > ERC721',
        '${imageUrl}',
        '${simpleFormatting}',
        604800,
        1,
        false,
        81911,
        81912,
        'ACTIVE',
        1553,
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
