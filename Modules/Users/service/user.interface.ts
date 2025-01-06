export interface UserBaseInterface {
  get getId(): string;
  get getName(): string;
  get getUserName(): string;
  get getEmail(): string;
  get getPassword(): string;
  get getRole(): string;
  get getDetails(): JSON | object;
  get getReputationPoints(): number;
}
