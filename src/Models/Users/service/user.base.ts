import { UserBaseInterface } from './user.interface';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

export class UserBase implements UserBaseInterface {
  private id: string;
  private name: string;
  private user_name?: string;
  private email: string;
  private role: string; // 'usuario estándar' | 'usuario verificado'
  private details: JSON | object;
  private reputationPoints: number;
  private password: string;

  constructor(
    name: string,
    email: string,
    role: string,
    password: string,
    details: JSON | object = {},
    user_name?: string,
  ) {
    this.id = uuidv4();
    this.name = name;
    this.user_name = user_name ?? this.name;
    this.email = email;
    this.role = role; // 'usuario estándar' | 'usuario verificado'
    this.password = password;
    this.details = details;
    this.reputationPoints = 0;
  }

  get getId(): string {
    return this.id;
  }

  get getName(): string {
    return this.name;
  }

  get getUserName(): string {
    return this.user_name;
  }

  get getEmail(): string {
    return this.email;
  }

  get getPassword(): string {
    return this.password;
  }

  get getRole(): string {
    return this.role;
  }

  get getDetails(): JSON | object {
    return this.details;
  }

  get getReputationPoints(): number {
    return this.reputationPoints;
  }

  // manage reputation points
  addReputation(points: number): void {
    this.reputationPoints += points;
  }

  subtractReputation(points: number): void {
    this.reputationPoints = Math.max(0, this.reputationPoints - points); // without negative reputation
  }

  // Method for encrypt password
  async encryptPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // method for verify password
  async comparePassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }
}
