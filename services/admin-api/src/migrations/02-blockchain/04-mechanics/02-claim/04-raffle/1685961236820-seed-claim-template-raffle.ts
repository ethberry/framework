import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet, NodeEnv } from "@ethberry/constants";
import { ns } from "@framework/constants";

export class SeedClaimTemplateRaffleAt1685961236820 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const zeroDateTime = new Date(0).toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102021201
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
        12101,
        1210101, -- Raffle ticket
        '1',
        102021201
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.claim (
        id,
        account,
        item_id,
        claim_status,
        claim_type,
        signature,
        nonce,
        end_timestamp,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        1021201,
        '${wallet}',
        102021201,
        'NEW',
        'TEMPLATE',
        '0x189f5940e334cd4037a2b00e4f381fd457465065bc917a095d64e402a429cd020df8be7631ef6306a34c1931e206a2972ba206f651fc2d550d6f059a073ac5ea1b',
        '0xd145bd1283e38b8c089f17fbd60487b2cb5e73f8bd0a357b1d72dee44c421f9e',
        '${zeroDateTime}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.claim RESTART IDENTITY CASCADE;`);
  }
}
