import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroHash, WeiPerEther, ZeroAddress } from "ethers";
import { subDays } from "date-fns";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryErc1155PurchaseAt1563804040230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
    const erc1155ContractSimpleAddress = process.env.ERC1155_RANDOM_ADDR || wallet;
    const erc1155ContractBlacklistAddress = process.env.ERC1155_BLACKLIST_ADDR || wallet;

    const now = new Date();
    const currentDateTime = now.toISOString();

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
        10501010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1050101",
          item: {
            tokenType: 3,
            token: erc1155ContractSimpleAddress,
            tokenId: "1050101",
            amount: "1000",
          },
          price: [
            {
              tokenType: 1,
              token: erc20TokenSimpleAddress,
              tokenId: "1020101",
              amount: WeiPerEther.toString(),
            },
          ],
        })}',
        null,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        10501011,
        '${erc1155ContractSimpleAddress}',
        '${ZeroHash}',
        'TransferSingle',
        '${JSON.stringify({
          operator: exchangeAddress,
          from: ZeroAddress,
          to: wallets[0],
          id: "105010101",
          value: "1000",
        })}',
        10501010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        10501012,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10501010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        10501020,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1050102",
          item: {
            tokenType: 3,
            token: erc1155ContractSimpleAddress,
            tokenId: "1050102",
            amount: "1000",
          },
          price: [
            {
              tokenType: 1,
              token: erc20TokenSimpleAddress,
              tokenId: "1020101",
              amount: WeiPerEther.toString(),
            },
          ],
        })}',
        null,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        10501021,
        '${erc1155ContractSimpleAddress}',
        '${ZeroHash}',
        'TransferSingle',
        '${JSON.stringify({
          operator: exchangeAddress,
          from: ZeroAddress,
          to: wallets[0],
          id: "105010201",
          value: "1000",
        })}',
        10501020,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        10501022,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10501020,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        10501030,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "105040",
          item: {
            tokenType: 3,
            token: erc1155ContractBlacklistAddress,
            tokenId: "105040101",
            amount: "1000",
          },
          price: [
            {
              tokenType: 1,
              token: erc20TokenSimpleAddress,
              tokenId: "1020101",
              amount: WeiPerEther.toString(),
            },
          ],
        })}',
        null,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        10501031,
        '${erc1155ContractBlacklistAddress}',
        '${ZeroHash}',
        'TransferSingle',
        '${JSON.stringify({
          operator: exchangeAddress,
          from: ZeroAddress,
          to: wallets[0],
          id: "105040101",
          value: "1000",
        })}',
        10501030,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        10501032,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        10501030,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
