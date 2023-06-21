import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroHash } from "ethers";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryErc721TransferAt1563804040130 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const erc721ContractSimpleAddress = process.env.ERC721_SIMPLE_ADDR || wallet;
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.event_history (
        id,
        address,
        transaction_hash,
        event_type,
        event_data,
        created_at,
        updated_at
      ) VALUES (
        10300001,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: wallets[1],
          tokenId: "1",
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10300002,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: wallets[2],
          tokenId: "2",
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10300003,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: wallets[0],
          tokenId: "3",
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10300004,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: wallets[2],
          tokenId: "4",
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10300005,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: wallets[0],
          tokenId: "5",
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10300006,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: wallets[1],
          tokenId: "6",
        })}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
