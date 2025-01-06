export interface UserModelDto {
  _id?: string;
  name?: string;
  user_name?: string;
  email?: string;
  password?: string;
  role?: string;
  details?: JSON | object;
  reputationPoints?: number;
}
