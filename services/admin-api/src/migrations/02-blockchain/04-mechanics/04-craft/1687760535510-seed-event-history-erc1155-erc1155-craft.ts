import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroAddress, ZeroHash } from "ethers";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryErc1155Erc1155CraftAt1687760535510 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
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
        10455010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Craft',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 1050501,
          items: [
            {
              tokenType: 4,
              token: erc1155ContractSimpleAddress,
              tokenId: "1050104",
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
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10455011,
        '${erc1155ContractSimpleAddress}',
        '${ZeroHash}',
        'TransferSingle',
        '${JSON.stringify({
          operator: exchangeAddress,
          from: ZeroAddress,
          to: wallets[0],
          id: "105010401",
          value: "1",
        })}',
        10455010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10455012,
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
        10455010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10455020,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Craft',
        '${JSON.stringify({
          account: wallets[0],
          externalId: 1050502,
          items: [
            {
              tokenType: 4,
              token: erc1155ContractSimpleAddress,
              tokenId: "1050105",
              amount: "1",
            },
          ],
          price: [
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
        10455021,
        '${erc1155ContractSimpleAddress}',
        '${ZeroHash}',
        'TransferSingle',
        '${JSON.stringify({
          operator: exchangeAddress,
          from: ZeroAddress,
          to: wallets[0],
          id: "105010401",
          value: "1",
        })}',
        10455020,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10455022,
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
        10455020,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
