import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedPyramidRulesErc20At1660436477220 implements MigrationInterface {
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

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        90211
      ), (
        'NATIVE',
        1101,
        110101, -- ETH
        '${WeiPerEther.toString()}',
        90212
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        90221
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        90222
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.pyramid_rules (
        id,
        title,
        description,
        duration_amount,
        penalty,
        deposit_id,
        reward_id,
        external_id,
        contract_id,
        pyramid_rule_status,
        created_at,
        updated_at
      ) VALUES (
        21,
        'ERC20 > NATIVE',
        '${simpleFormatting}',
        604800,
        1,
        90211,
        90212,
        21,
        4,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        22,
        'ERC20 > ERC20',
        '${simpleFormatting}',
        604800,
        1,
        90221,
        90222,
        22,
        4,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.pyramid_rules`);
  }
}
