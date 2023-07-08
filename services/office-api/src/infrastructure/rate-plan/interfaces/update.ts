export interface IRatePlanRowUpdateDto {
  ratePlanId: number;
  amount: number;
}

export interface IRatePlanUpdateDto {
  limits: Array<IRatePlanRowUpdateDto>;
}
