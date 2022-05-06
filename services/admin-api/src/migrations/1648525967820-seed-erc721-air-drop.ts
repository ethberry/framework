import { MigrationInterface, QueryRunner } from "typeorm";
import { wallet } from "@gemunion/constants";

import { ns } from "@framework/constants";

export class SeedErc721Airdrop1648525967820 implements MigrationInterface {
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
      INSERT INTO ${ns}.erc721_air_drop (
        owner,
        erc721_template_id,
        signature,
        created_at,
        updated_at
      ) VALUES (
        '${wallet}',
        9,
        '${signDbItem1}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        10,
        '${signDbItem2}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        11,
        '${signDbItem3}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        9,
        '${signDbItem4}',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc721_air_drop RESTART IDENTITY CASCADE;`);
  }
}
