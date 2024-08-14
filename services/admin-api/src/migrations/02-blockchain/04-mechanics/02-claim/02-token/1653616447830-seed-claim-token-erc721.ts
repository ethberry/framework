import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedClaimTokenErc721At1653616447830 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const zeroDateTime = new Date(0).toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102020311
      ), (
        102020312
      ), (
        102020313
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        token_id,
        amount,
        asset_id
      ) VALUES (
        'ERC721',
        10306,
        1030601, -- Sword
        103060101, -- Sword
        '1',
        102020311
      ), (
        'ERC721',
        10306,
        1030602, -- Mace
        103060201, -- Mace
        '1',
        102020312
      ), (
        'ERC721',
        10306,
        1030603, -- Axe
        103060301, -- Axe
        '1',
        102020313
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
        1010311,
        '${wallet}',
        102020311,
        'NEW',
        'TOKEN',
        '0x189f5940e334cd4037a2b00e4f381fd457465065bc917a095d64e402a429cd020df8be7631ef6306a34c1931e206a2972ba206f651fc2d550d6f059a073ac5ea1b',
        '0xd145bd1283e38b8c089f17fbd60487b2cb5e73f8bd0a357b1d72dee44c421f9e',
        '${zeroDateTime}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1010312,
        '${wallet}',
        102020312,
        'REDEEMED',
        'TOKEN',
        '0x53aead30f3b57f52c6ea7d23a71f47d3d03811dae35a71fdcee396b70ba8169b073a7c566c978c327db9ded895edd761173708e9ab1e567554b1acdadf11a7df1b',
        '0xc4784e41b015c3476ab061982cd1ac4407b2123b50a5b6dd5b2ce09c81468fed',
        '${zeroDateTime}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1010313,
        '${wallet}',
        102020313,
        'EXPIRED',
        'TOKEN',
        '0xa5eb1c7f0edf69c9bdc89ef28773ecbeb44f0960d7c2d2b13741faee14f6f96931f5cc38d539de4ea48f55c78f4decc39f8d30df0ab21fc4100153c46010747b1c',
        '0x151aa8477d5770833002170e74834ce285adc242b33ffde12ad87d2a500cf369',
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
