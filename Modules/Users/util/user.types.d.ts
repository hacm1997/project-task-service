export type UserQuery = Partial<{
  name: RegExp;
  role: RegExp;
  email: RegExp;
  reputationPoints: { $gte: number };
}>;

export interface UserToClient {
  userId: string;
  email: string;
  name: string;
  role: string;
  details: JSON;
}
