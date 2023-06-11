import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroHash, WeiPerEther, ZeroAddress } from "ethers";
import { subDays } from "date-fns";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryErc721PurchaseAt1563804040230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
    const erc721ContractSimpleAddress = process.env.ERC721_RANDOM_ADDR || wallet;

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
        1301010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1301011,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "13010101",
        })}',
        1301010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1301012,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1301010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1301020,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "2"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1301021,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "13010201",
        })}',
        1301020,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1301022,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1301020,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1301030,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "3"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        1301031,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "13010301",
        })}',
        1301030,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        1301032,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1301030,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
