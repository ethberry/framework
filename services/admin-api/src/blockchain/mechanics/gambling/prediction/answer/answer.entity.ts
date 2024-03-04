import { Entity } from "typeorm";

import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IPredictionAnswer } from "@framework/types";

@Entity({ schema: ns, name: "prediction_answer" })
export class PredictionAnswerEntity extends IdDateBaseEntity implements IPredictionAnswer {}
