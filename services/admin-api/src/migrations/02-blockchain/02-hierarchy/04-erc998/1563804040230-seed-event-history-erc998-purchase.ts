import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";
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
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "140101",
          item: [2, erc998ContractSimpleAddress, "140101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1401011,
        '${erc998ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[0],
          tokenId: "14010101",
        })}',
        1401010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1401012,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1401010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1401020,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "140101",
          item: [2, erc998ContractSimpleAddress, "140101", "2"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1401021,
        '${erc998ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[0],
          tokenId: "14010102",
        })}',
        1401020,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1401022,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1401020,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1401030,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "140101",
          item: [2, erc998ContractSimpleAddress, "140101", "3"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        1401031,
        '${erc998ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[0],
          tokenId: "14010103",
        })}',
        1401030,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        1401032,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1401030,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        1404010,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "140401",
          item: [2, erc998ContractSimpleAddress, "140401", "3"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1404011,
        '${erc998ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[0],
          tokenId: "14040101",
        })}',
        1404010,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1404012,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1404010,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1404020,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "140402",
          item: [2, erc998ContractSimpleAddress, "140402", "3"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1404021,
        '${erc998ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[0],
          tokenId: "14040201",
        })}',
        1404020,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1404022,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1404020,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1404030,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "140403",
          item: [2, erc998ContractSimpleAddress, "140403", "3"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1404031,
        '${erc998ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[0],
          tokenId: "14040301",
        })}',
        1404030,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1404032,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1404030,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1404040,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "140404",
          item: [2, erc998ContractSimpleAddress, "140404", "3"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1404041,
        '${erc998ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[0],
          tokenId: "14040401",
        })}',
        1404040,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1404042,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1404040,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1404050,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "140405",
          item: [2, erc998ContractSimpleAddress, "140405", "3"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1404051,
        '${erc998ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[0],
          tokenId: "14040501",
        })}',
        1404050,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1404052,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1404050,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1405010,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "140501",
          item: [2, erc998ContractSimpleAddress, "140501", "3"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        1405011,
        '${erc998ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[0],
          tokenId: "14050101",
        })}',
        1405010,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        1405012,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1405010,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        1405020,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "140502",
          item: [2, erc998ContractSimpleAddress, "140502", "3"],
          price: [[1, erc20TokenSimpleAddress, "120101", constants.WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        1405021,
        '${erc998ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[0],
          tokenId: "14050201",
        })}',
        1405020,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        1405022,
        '${erc20TokenSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: constants.WeiPerEther.toString(),
        })}',
        1405020,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
