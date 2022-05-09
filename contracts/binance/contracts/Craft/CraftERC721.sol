// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "../Marketplace/interfaces/IEIP712ERC1155.sol";
import "../Marketplace/interfaces/IEIP712ERC721.sol";

contract CraftERC721 is AccessControl, Pausable {
  using Address for address;

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  struct Recipe {
    address resources;
    uint256[] ids;
    uint256[] amounts;
    address reward;
    uint256 templateId;
    uint256 dropboxId;
    bool active;
  }

  event RecipeCreated(
    uint256 recipeId,
    address resources,
    uint256[] ids,
    uint256[] amounts,
    address reward,
    uint256 templateId,
    uint256 dropboxId
  );

  event RecipeUpdated(uint256 recipeId, bool active);

  event RecipeCrafted(address from, uint256 recipeId);

  IEIP712ERC721 private _item;
  IEIP712ERC1155 private _resources;

  mapping(uint256 => Recipe) private _recipes;

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function createRecipe(
    uint256 recipeId,
    address resources,
    uint256[] memory ids,
    uint256[] memory amounts,
    address reward,
    uint256 templateId,
    uint256 dropboxId
  ) public onlyRole(DEFAULT_ADMIN_ROLE) {
    require(ids.length == amounts.length, "CraftERC721: ids and amounts length mismatch");
    Recipe memory recipe = _recipes[recipeId];
    require(recipe.templateId == 0, "CraftERC721: recipe already exist");

    _recipes[recipeId] = Recipe(resources, ids, amounts, reward, templateId, dropboxId, true);
    emit RecipeCreated(recipeId, resources, ids, amounts, reward, templateId, dropboxId);
  }

  function updateRecipe(uint256 recipeId, bool active) public onlyRole(DEFAULT_ADMIN_ROLE) {
    Recipe memory recipe = _recipes[recipeId];
    require(recipe.templateId != 0, "CraftERC721: recipe does not exist");
    _recipes[recipeId].active = active;
    emit RecipeUpdated(recipeId, active);
  }

  function craftCommon(uint256 recipeId) public {
    Recipe memory recipe = _recipes[recipeId];

    require(recipe.active, "CraftERC721: recipe is not active");

    emit RecipeCrafted(_msgSender(), recipeId);

    IEIP712ERC1155(recipe.resources).burnBatch(_msgSender(), recipe.ids, recipe.amounts);
    IEIP712ERC721(recipe.reward).mintCommon(_msgSender(), recipe.templateId);
  }

  function craftRandom(uint256 recipeId) public {
    Recipe memory recipe = _recipes[recipeId];

    require(recipe.active, "CraftERC721: recipe is not active");

    emit RecipeCrafted(_msgSender(), recipeId);

    IEIP712ERC1155(recipe.resources).burnBatch(_msgSender(), recipe.ids, recipe.amounts);
    IEIP712ERC721(recipe.reward).mintRandom(_msgSender(), recipe.templateId, recipe.dropboxId);
  }

  function pause() public virtual onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public virtual onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  receive() external payable {
    revert();
  }
}
