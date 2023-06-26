import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroAddress, ZeroHash } from "ethers";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryErc721Erc1155CraftAt1687760533510 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const erc721ContractRandomAddress = process.env.ERC721_RANDOM_ADDR || wallet;
    const erc1155ContractSimpleAddress = process.env.ERC1155_SIMPLE_ADDR || wallet;

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.event_history (
        id,
        address,
        transaction_hash,
        event_type,
        event_data,
        parent_id,
        created_at,
        updated_at
      ) VALUES (
        10435010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Craft',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 1030501,
          items: [
            {
              tokenType: 2,
              token: erc721ContractRandomAddress,
              tokenId: "1030601",
              amount: "1",
            },
          ],
          price: [
            {
              tokenType: 4,
              token: erc1155ContractSimpleAddress,
              tokenId: "1050102",
              amount: "10",
            },
            {
              tokenType: 4,
              token: erc1155ContractSimpleAddress,
              tokenId: "1050103",
              amount: "10",
            },
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10435011,
        '${erc721ContractRandomAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "103060101",
        })}',
        10435010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10435012,
        '${erc1155ContractSimpleAddress}',
        '${ZeroHash}',
        'TransferSingle',
        '${JSON.stringify({
          operator: exchangeAddress,
          from: wallets[0],
          to: exchangeAddress,
          id: "105010201",
          value: "10",
        })}',
        10435010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10435013,
        '${erc1155ContractSimpleAddress}',
        '${ZeroHash}',
        'TransferSingle',
        '${JSON.stringify({
          operator: exchangeAddress,
          from: wallets[0],
          to: exchangeAddress,
          id: "105010301",
          value: "10",
        })}',
        10435010,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
