export interface IReferralProgramLevelDto {
  level: number;
  share: number;
}

export interface IReferralProgramCreateDto {
  levels: Array<IReferralProgramLevelDto>;
}
