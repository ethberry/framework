// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@gemunion/contracts-mocks/contracts/Wallet.sol";
import "@gemunion/contracts-utils/contracts/roles.sol";

import "../../Exchange/lib/ExchangeUtils.sol";
import "../../utils/constants.sol";
import "../../utils/errors.sol";

import "./interfaces/IERC721RaffleTicket.sol";
import "./interfaces/IRaffle.sol";

abstract contract RaffleRandom is AccessControl, Pausable, Wallet {
  using Address for address;
  using SafeERC20 for IERC20;

  event RoundStarted(uint256 roundId, uint256 startTimestamp, uint256 maxTicket, Asset ticket, Asset price);
  event RoundEnded(uint256 round, uint256 endTimestamp);
  event RoundFinalized(uint256 round, uint256 prizeIndex, uint256 prizeNumber);
  event Released(uint256 round, uint256 amount);
  event Prize(address account, uint256 roundId, uint256 ticketId, uint256 amount);
  event PaymentEthReceived(address from, uint256 amount);

  // RAFFLE
  struct Round {
    uint256 roundId;
    uint256 startTimestamp;
    uint256 endTimestamp;
    uint256 balance; // left after get prize
    uint256 total; // max money before
    //    Counters.Counter ticketCounter; // all round tickets counter
    uint256[] tickets; // all round tickets ids
    uint256 prizeNumber; // prize number
    uint256 requestId;
    uint256 maxTicket;
    // TODO Asset[]?
    Asset acceptedAsset;
    Asset ticketAsset;
  }

  Round[] internal _rounds;

  constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(PAUSER_ROLE, _msgSender());
    _grantRole(MINTER_ROLE, _msgSender());

    Round memory rootRound;
    rootRound.startTimestamp = block.timestamp;
    rootRound.endTimestamp = block.timestamp;
    _rounds.push(rootRound);
  }

  // TICKET
  function printTicket(
    uint256 externalId,
    address account
  ) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256 tokenId, uint256 roundId, uint256 index) {
    // get current round
    roundId = _rounds.length - 1;
    Round storage currentRound = _rounds[roundId];

    if (currentRound.endTimestamp != 0) {
      revert WrongRound();
    }

    // allow all
    if (currentRound.maxTicket > 0 && currentRound.tickets.length >= currentRound.maxTicket) {
      revert LimitExceed();
    }

    currentRound.balance += currentRound.acceptedAsset.amount;
    currentRound.total += currentRound.acceptedAsset.amount;

    tokenId = IERC721RaffleTicket(currentRound.ticketAsset.token).mintTicket(account, roundId, externalId);

    // TODO overflow check?
    currentRound.tickets.push(tokenId);

    // serial number of ticket inside round
    index = currentRound.tickets.length;
  }

  function startRound(Asset memory ticket, Asset memory price, uint256 maxTicket) public onlyRole(DEFAULT_ADMIN_ROLE) {
    Round memory prevRound = _rounds[_rounds.length - 1];
    if (prevRound.endTimestamp == 0) revert NotComplete();

    Round memory nextRound;
    _rounds.push(nextRound);

    uint256 roundId = _rounds.length - 1;

    Round storage currentRound = _rounds[roundId];
    currentRound.roundId = roundId;
    currentRound.startTimestamp = block.timestamp;
    currentRound.maxTicket = maxTicket;
    currentRound.ticketAsset = ticket;
    currentRound.acceptedAsset = price;

    emit RoundStarted(roundId, block.timestamp, maxTicket, ticket, price);
  }

  // GETTERS
  function getRoundsCount() public view returns (uint256) {
    return _rounds.length;
  }

  function getRound(uint256 roundId) public view returns (Round memory) {
    if (_rounds.length < roundId) revert NotExist();
    return _rounds[roundId];
  }

  function getCurrentRoundInfo() public view returns (RaffleRoundInfo memory) {
    Round storage round = _rounds[_rounds.length - 1];
    return
      RaffleRoundInfo(
        round.roundId,
        round.startTimestamp,
        round.endTimestamp,
        round.maxTicket,
        round.prizeNumber,
        round.acceptedAsset,
        round.ticketAsset
      );
  }

//  function getLotteryInfo() public view returns (RaffleConfig memory) {
//    return RaffleConfig(_timeLag, comm);
//  }

  // RANDOM
  function getRandomNumber() internal virtual returns (uint256 requestId);

  function endRound() external onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 roundNumber = _rounds.length - 1;
    Round storage currentRound = _rounds[roundNumber];

    // TODO should never happen?
    if (currentRound.roundId != roundNumber) {
      revert WrongRound();
    }

    if (currentRound.endTimestamp != 0) {
      revert NotActive();
    }

    currentRound.endTimestamp = block.timestamp;
    currentRound.requestId = getRandomNumber();

    emit RoundEnded(roundNumber, block.timestamp);
  }

  function releaseFunds(uint256 roundNumber) external onlyRole(DEFAULT_ADMIN_ROLE) {
    Round storage currentRound = _rounds[roundNumber];
    if (currentRound.balance == 0) revert ZeroBalance();

    uint256 roundBalance = currentRound.balance;
    currentRound.balance = 0;

    currentRound.acceptedAsset.amount = roundBalance;
    ExchangeUtils.spend(
      ExchangeUtils._toArray(currentRound.acceptedAsset),
      _msgSender(),
      DisabledTokenTypes(false, false, false, false, false)
    );

    emit Released(roundNumber, roundBalance);
  }

  // ROUND
  function fulfillRandomWords(uint256, uint256[] memory randomWords) internal virtual {
    Round storage currentRound = _rounds[_rounds.length - 1];

    // calculate wining numbers
    uint256 len = currentRound.tickets.length;

    // prizeNumber - tickets[index] or Zero if no tickets sold
    uint256 prizeIndex = len > 0 ? uint256(uint8(randomWords[0] % len)) : 0;

    // prizeNumber - winner's tokenId
    // Zero if no tickets sold
    currentRound.prizeNumber = len > 0 ? currentRound.tickets[prizeIndex] : 0;

    emit RoundFinalized(currentRound.roundId, prizeIndex, currentRound.prizeNumber /* ticket Id = ticket No*/);
  }

  function getPrize(uint256 tokenId, uint256 roundId) external {
    if (roundId > _rounds.length - 1) {
      revert WrongRound();
    }

    Round storage ticketRound = _rounds[roundId];

    if (ticketRound.endTimestamp == 0) {
      revert NotComplete();
    }

    // TODO OR approved?
    if (IERC721(ticketRound.ticketAsset.token).ownerOf(tokenId) != _msgSender()) {
      revert NotAnOwner();
    }

    IERC721RaffleTicket ticketFactory = IERC721RaffleTicket(ticketRound.ticketAsset.token);

    TicketRaffle memory data = ticketFactory.getTicketData(tokenId);

    // check token's roundId
    if (data.round != roundId) {
      revert WrongRound();
    }

    // check token's prize status
    if (data.prize) {
      revert WrongToken();
    }

    // check if tokenId is round winner
    if (tokenId == ticketRound.prizeNumber) {
      // ticketFactory.burn(tokenId);
      // set prize status and multiplier
      ticketFactory.setPrize(tokenId, ticketRound.tickets.length);
      emit Prize(_msgSender(), roundId, tokenId, ticketRound.tickets.length);
    } else {
      revert NotInList();
    }
  }

  // PAUSABLE
  /**
   * @dev Triggers stopped state.
   *
   * Requirements:
   *
   * - The contract must not be paused.
   */
  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  /**
   * @dev Returns to normal state.
   *
   * Requirements:
   *
   * - The contract must be paused.
   */
  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  // COMMON
  receive() external payable override {
    emit PaymentEthReceived(_msgSender(), msg.value);
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, Wallet) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
