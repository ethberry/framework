import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedStakingRulesNativeAt1654751224210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        80111
      ), (
        80112
      ), (
        80121
      ), (
        80122
      ), (
        80131
      ), (
        80132
      ), (
        80141
      ), (
        80142
      ), (
        80151
      ), (
        80152
      ), (
        80199
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
        4101,
        410101, -- ETH
        '${constants.WeiPerEther.toString()}',
        80111
      ), (
        'NATIVE',
        4101,
        410101, -- ETH
        '${constants.WeiPerEther.toString()}',
        80112
      ), (
        'NATIVE',
        4101,
        410101, -- ETH
        '${constants.WeiPerEther.toString()}',
        80121
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        80122
      ), (
        'NATIVE',
        4101,
        410101, -- ETH
        '${constants.WeiPerEther.toString()}',
        80131
      ), (
        'ERC721',
        1306,
        130601, -- sword
        1,
        80132
      ), (
        'NATIVE',
        4101,
        410101, -- ETH
        '${constants.WeiPerEther.toString()}',
        80141
      ), (
        'ERC998',
        1406,
        140601, -- warrior
        1,
        80142
      ), (
        'NATIVE',
        4101,
        410101, -- ETH
        '${constants.WeiPerEther.toString()}',
        80151
      ), (
        'ERC1155',
        1501,
        150101, -- gold
        10,
        80152
      ), (
        'NATIVE',
        4101,
        410101, -- ETH
        '${constants.WeiPerEther.toString()}',
        80199
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
        created_at,
        updated_at
      ) VALUES (
        11,
        'NATIVE > NATIVE',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80111,
        80112,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        12,
        'NATIVE > ERC20',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80121,
        80122,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13,
        'NATIVE > ERC721',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80131,
        80132,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        14,
        'NATIVE > ERC998',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80141,
        80142,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        15,
        'NATIVE > ERC1155',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80151,
        80152,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        19,
        'NATIVE > NONE',
        '${simpleFormatting}',
        604800,
        1,
        false,
        80199,
        null,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.staking_rules`);
  }
}
