import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedPyramidRulesErc20At1660436477120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        90211
      ), (
        90212
      ), (
        90221
      ), (
        90222
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 90252, true);`);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC20',
        201,
        201001, -- space credit
        '${constants.WeiPerEther.toString()}',
        90211
      ), (
        'NATIVE',
        101,
        101001, -- ETH
        '${constants.WeiPerEther.toString()}',
        90212
      ), (
        'ERC20',
        201,
        201001, -- space credit
        '${constants.WeiPerEther.toString()}',
        90221
      ), (
        'ERC20',
        201,
        201001, -- space credit
        '${constants.WeiPerEther.toString()}',
        90222
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.pyramid_rules (
        title,
        description,
        duration,
        penalty,
        recurrent,
        deposit_id,
        reward_id,
        external_id,
        staking_status,
        created_at,
        updated_at
      ) VALUES (
        'ERC20 > NATIVE',
        '${simpleFormatting}',
        30,
        1,
        false,
        90211,
        90212,
        21,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'ERC20 > ERC20',
        '${simpleFormatting}',
        30,
        1,
        false,
        90221,
        90222,
        22,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.pyramid_rules`);
  }
}
