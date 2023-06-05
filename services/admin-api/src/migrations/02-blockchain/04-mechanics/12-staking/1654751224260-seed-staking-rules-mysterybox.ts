import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedStakingRulesMysteryboxAt1654751224260 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        80611
      ), (
        80612
      ), (
        80621
      ), (
        80622
      ), (
        80631
      ), (
        80632
      ), (
        80641
      ), (
        80642
      ), (
        80651
      ), (
        80652
      ), (
        80699
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
        1101,
        110101, -- ETH
        '${WeiPerEther.toString()}',
        80611
      ), (
        'ERC721',
        1601,
        160101, -- sword mysterybox
        1,
        80612
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        80621
      ), (
        'ERC721',
        1601,
        160101, -- sword mysterybox
        1,
        80622
      ), (
        'ERC721',
        1306,
        130601, -- sword
        1,
        80631
      ), (
        'ERC721',
        1601,
        160101, -- sword mysterybox
        1,
        80632
      ), (
        'ERC998',
        1406,
        140601, -- warrior
        1,
        80641
      ), (
        'ERC721',
        1601,
        160101, -- sword mysterybox
        1,
        80642
      ), (
        'ERC1155',
        1501,
        150101, -- gold
        1,
        80651
      ), (
        'ERC721',
        1601,
        160101, -- sword mysterybox
        1,
        80652
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
        61,
        'NATIVE > MYSTERYBOX',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80611,
        80612,
        'ACTIVE',
        3,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        62,
        'ERC20 > MYSTERYBOX',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80621,
        80622,
        'ACTIVE',
        3,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        63,
        'ERC721 > MYSTERYBOX',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80631,
        80632,
        'ACTIVE',
        3,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        64,
        'ERC998 > MYSTERYBOX',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80641,
        80642,
        'ACTIVE',
        3,       
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        65,
        'ERC1155 > MYSTERYBOX',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80651,
        80652,
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
