import { MigrationInterface, QueryRunner } from "typeorm";
import { wallet } from "@gemunion/constants";

import { ns } from "@framework/constants";

export class SeedAirdropErc721At1563804040420 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const signDbItem1 =
      "0x87e254d38d2f19e6a216784e00932742de8451d05b9e673e4dae501f10fcfa1636311099711b9c096a1e7f7533922131fac49de1af4a20e1766ce1b37745e68d1c";
    const signDbItem2 =
      "0x82995ce55e5d9a39fc285eb6a89f4a0348f222267c8d56037cbdc3af583b763d5311fc17db1371bb93fe3f62dda5d9a90428ed3559d088505586c2c1464e57ee1b";
    const signDbItem3 =
      "0x1dba5f2c6fd65879a8fc6b15246fd4739f8b8569a54f6eb12c65ce733963dd144315e3ef61a108f48f20efd74e33669b6c7f5aafc89123fbbcfe5bd0e0fa6f9a1b";
    const signDbItem4 =
      "0x385e0d108f82a9c44a168e7a86815ba90380c61b07100086f4fecebe6d84611534295b17ffec9af85dd76f5e1096421eabe79915a0fde321f85aabc48709aaa71b";

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id,
        external_id,
        asset_type
      ) VALUES (
        50101,
        50101,
        'AIRDROP'
      ), (
        50102,
        50102,
        'AIRDROP'
      ), (
        50103,
        50103,
        'AIRDROP'
      ), (
        50104,
        50104,
        'AIRDROP'
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        token_id,
        amount,
        asset_id
      ) VALUES (
        'ERC721',
        13,
        20101, -- sword
        '1',
        50101
      ), (
        'ERC721',
        13,
        20102, -- mace
        '1',
        50102
      ), (
        'ERC721',
        13,
        20103, -- axe
        '1',
        50103
      ), (
        'ERC1155',
        31,
        40101, -- gold
        '1000',
        50104
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.airdrop (
        account,
        item_id,
        airdrop_status,
        signature,
        created_at,
        updated_at
      ) VALUES (
        '${wallet}',
        50101,
        'NEW',
        '${signDbItem1}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        50102,
        'NEW',
        '${signDbItem2}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        50103,
        'UNPACKED',
        '${signDbItem3}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        50104,
        'REDEEMED',
        '${signDbItem4}',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.air_drop RESTART IDENTITY CASCADE;`);
  }
}
