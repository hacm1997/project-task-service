export type UserQuery = Partial<{
  name: RegExp;
  role: string;
  reputationPoints: { $gte: number };
}>;

export interface UserToClient {
  userId: string;
  email: string;
  name: string;
  role: string;
  details: JSON;
}
