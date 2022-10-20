import { MigrationInterface, QueryRunner } from "typeorm";
import { wallet } from "@gemunion/constants";

import { ns } from "@framework/constants";

export class SeedClaimErc721At1653616447830 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const zeroDateTime = new Date(0).toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        13001
      ), (
        13002
      ), (
        13003
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 10003, true);`);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC721',
        1306,
        130601, -- sword
        '1',
        13001
      ), (
        'ERC721',
        1306,
        130602, -- mace
        '1',
        13002
      ), (
        'ERC721',
        1306,
        130603, -- axe
        '1',
        13003
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.claim (
        account,
        item_id,
        claim_status,
        signature,
        nonce,
        end_timestamp,
        created_at,
        updated_at
      ) VALUES (
        '${wallet}',
        13001,
        'NEW',
        '0x189f5940e334cd4037a2b00e4f381fd457465065bc917a095d64e402a429cd020df8be7631ef6306a34c1931e206a2972ba206f651fc2d550d6f059a073ac5ea1b',
        '0xd145bd1283e38b8c089f17fbd60487b2cb5e73f8bd0a357b1d72dee44c421f9e',
        '${zeroDateTime}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        13002,
        'NEW',
        '0x53aead30f3b57f52c6ea7d23a71f47d3d03811dae35a71fdcee396b70ba8169b073a7c566c978c327db9ded895edd761173708e9ab1e567554b1acdadf11a7df1b',
        '0xc4784e41b015c3476ab061982cd1ac4407b2123b50a5b6dd5b2ce09c81468fed',
        '${zeroDateTime}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        13003,
        'UNPACKED',
        '0xa5eb1c7f0edf69c9bdc89ef28773ecbeb44f0960d7c2d2b13741faee14f6f96931f5cc38d539de4ea48f55c78f4decc39f8d30df0ab21fc4100153c46010747b1c',
        '0x151aa8477d5770833002170e74834ce285adc242b33ffde12ad87d2a500cf369',
        '${zeroDateTime}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.claim RESTART IDENTITY CASCADE;`);
  }
}
