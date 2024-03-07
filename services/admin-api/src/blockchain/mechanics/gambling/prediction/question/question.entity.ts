import { Entity } from "typeorm";

import { ns } from "@framework/constants";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IPredictionQuestion } from "@framework/types";

@Entity({ schema: ns, name: "prediction_question" })
export class PredictionQuestionEntity extends SearchableEntity implements IPredictionQuestion {}
