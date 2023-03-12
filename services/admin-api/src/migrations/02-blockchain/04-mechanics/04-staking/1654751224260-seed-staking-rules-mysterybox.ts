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

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC721',
        1601,
        160101, -- sword mysterybox
        1,
        80611
      ), (
        'NATIVE',
        1101,
        110101, -- ETH
        '${constants.WeiPerEther.toString()}',
        80612
      ), (
        'ERC721',
        1601,
        160101, -- sword mysterybox
        1,
        80621
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        80622
      ), (
        'ERC721',
        1601,
        160101, -- sword mysterybox
        1,
        80631
      ), (
        'ERC721',
        1306,
        130601, -- sword
        1,
        80632
      ), (
        'ERC721',
        1601,
        160101, -- sword mysterybox
        1,
        80641
      ), (
        'ERC998',
        1406,
        140601, -- warrior
        1,
        80642
      ), (
        'ERC721',
        1601,
        160101, -- sword mysterybox
        1,
        80651
      ), (
        'ERC1155',
        1501,
        150101, -- gold
        1,
        80652
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.staking_rules (
        title,
        description,
        duration_amount,
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
        2592000,
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
        2592000,
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
        2592000,
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
        2592000,
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
        2592000,
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
