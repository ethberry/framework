// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "../ERC1155/interfaces/IERC1155Simple.sol";
import "../ERC721/interfaces/IERC721Simple.sol";
import "../ERC721/interfaces/IERC721Random.sol";

contract ERC1155ERC721Craft is AccessControl, Pausable {
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
    require(ids.length == amounts.length, "ERC1155ERC721Craft: ids and amounts length mismatch");
    Recipe memory recipe = _recipes[recipeId];
    require(recipe.templateId == 0, "ERC1155ERC721Craft: recipe already exist");

    _recipes[recipeId] = Recipe(resources, ids, amounts, reward, templateId, dropboxId, true);
    emit RecipeCreated(recipeId, resources, ids, amounts, reward, templateId, dropboxId);
  }

  function updateRecipe(uint256 recipeId, bool active) public onlyRole(DEFAULT_ADMIN_ROLE) {
    Recipe memory recipe = _recipes[recipeId];
    require(recipe.templateId != 0, "ERC1155ERC721Craft: recipe does not exist");
    _recipes[recipeId].active = active;
    emit RecipeUpdated(recipeId, active);
  }

  function craftCommon(uint256 recipeId) public {
    Recipe memory recipe = _recipes[recipeId];

    require(recipe.active, "ERC1155ERC721Craft: recipe is not active");

    emit RecipeCrafted(_msgSender(), recipeId);

    IERC1155Simple(recipe.resources).burnBatch(_msgSender(), recipe.ids, recipe.amounts);
    IERC721Simple(recipe.reward).mintCommon(_msgSender(), recipe.templateId);
  }

  function craftRandom(uint256 recipeId) public {
    Recipe memory recipe = _recipes[recipeId];

    require(recipe.active, "ERC1155ERC721Craft: recipe is not active");

    emit RecipeCrafted(_msgSender(), recipeId);

    IERC1155Simple(recipe.resources).burnBatch(_msgSender(), recipe.ids, recipe.amounts);
    IERC721Random(recipe.reward).mintRandom(_msgSender(), recipe.templateId, recipe.dropboxId);
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
