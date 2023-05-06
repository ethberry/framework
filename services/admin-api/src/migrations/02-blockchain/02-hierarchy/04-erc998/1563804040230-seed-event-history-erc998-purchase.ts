import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroHash, ZeroAddress, WeiPerEther } from "ethers";
import { subDays } from "date-fns";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryErc998PurchaseAt1563804040230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
    const erc998ContractSimpleAddress = process.env.ERC998_RANDOM_ADDR || wallet;

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
        1401010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "140101",
          item: [2, erc998ContractSimpleAddress, "140101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1401011,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "14010101",
        })}',
        1401010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1401012,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1401010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1401020,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "140101",
          item: [2, erc998ContractSimpleAddress, "140101", "2"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1401021,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "14010102",
        })}',
        1401020,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1401022,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1401020,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1401030,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "140101",
          item: [2, erc998ContractSimpleAddress, "140101", "3"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        1401031,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "14010103",
        })}',
        1401030,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        1401032,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1401030,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        1401040,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "140101",
          item: [2, erc998ContractSimpleAddress, "140101", "4"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1401041,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "14010104",
        })}',
        1401040,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1401042,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1401040,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1401050,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "140101",
          item: [2, erc998ContractSimpleAddress, "140101", "5"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1401051,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "14010105",
        })}',
        1401050,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1401052,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1401050,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1401060,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "140101",
          item: [2, erc998ContractSimpleAddress, "140101", "6"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1401061,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "14010106",
        })}',
        1401060,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1401062,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1401060,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1401070,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[1],
          externalId: "140101",
          item: [2, erc998ContractSimpleAddress, "140101", "7"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1401071,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[1],
          tokenId: "14010107",
        })}',
        1401070,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1401072,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1401070,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1401080,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[1],
          externalId: "140101",
          item: [2, erc998ContractSimpleAddress, "140101", "8"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1401081,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[1],
          tokenId: "14010108",
        })}',
        1401080,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1401082,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1401080,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1401090,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[2],
          externalId: "140101",
          item: [2, erc998ContractSimpleAddress, "140101", "9"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        1401091,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[2],
          tokenId: "14010109",
        })}',
        1401090,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        1401092,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1401090,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        1401100,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[2],
          externalId: "140101",
          item: [2, erc998ContractSimpleAddress, "140101", "10"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        1401101,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[2],
          tokenId: "14010110",
        })}',
        1401100,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        1401102,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1401100,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
