import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

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
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 80652, true);`);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC721',
        601,
        601001, -- sword mysterybox
        1,
        80611
      ), (
        'NATIVE',
        101,
        101001, -- ETH
        '${constants.WeiPerEther.toString()}',
        80612
      ), (
        'ERC721',
        601,
        601001, -- sword mysterybox
        1,
        80621
      ), (
        'ERC20',
        201,
        201001, -- space credit
        '${constants.WeiPerEther.toString()}',
        80622
      ), (
        'ERC721',
        601,
        601001, -- sword mysterybox
        1,
        80631
      ), (
        'ERC721',
        306,
        306001, -- sword
        1,
        80632
      ), (
        'ERC721',
        601,
        601001, -- sword mysterybox
        1,
        80641
      ), (
        'ERC998',
        406,
        406001, -- warrior
        1,
        80642
      ), (
        'ERC721',
        601,
        601001, -- sword mysterybox
        1,
        80651
      ), (
        'ERC1155',
        501,
        501001, -- gold
        1,
        80652
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.staking_rules (
        title,
        description,
        duration,
        penalty,
        recurrent,
        deposit_id,
        reward_id,
        external_id,
        staking_rule_status,
        created_at,
        updated_at
      ) VALUES (
        'MYSTERYBOX > NATIVE',
        '${simpleFormatting}',
        30,
        1,
        false,
        80611,
        80612,
        31,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'MYSTERYBOX > ERC20',
        '${simpleFormatting}',
        30,
        1,
        false,
        80621,
        80622,
        32,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'MYSTERYBOX > ERC721',
        '${simpleFormatting}',
        30,
        1,
        false,
        80631,
        80632,
        33,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'MYSTERYBOX > ERC998',
        '${simpleFormatting}',
        30,
        1,
        false,
        80641,
        80642,
        34,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'MYSTERYBOX > ERC1155',
        '${simpleFormatting}',
        30,
        1,
        false,
        80651,
        80652,
        35,
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
