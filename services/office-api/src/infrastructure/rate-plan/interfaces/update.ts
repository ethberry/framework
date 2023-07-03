export interface IRatePlanRowUpdateDto {
  ratePlanId: number;
  amount: number;
}

export interface IRatePlanUpdateDto {
  list: Array<IRatePlanRowUpdateDto>;
}
