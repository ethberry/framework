import {ICategoryUpdateDto} from "../interfaces";
import {CategoryCreateDto} from "./create";

export class CategoryUpdateDto extends CategoryCreateDto implements ICategoryUpdateDto {}
