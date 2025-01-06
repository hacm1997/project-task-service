export interface ProjectBaseInterface {
  get getId(): string;
  get getName(): string;
  get getDescription(): string;
  get getOwner(): string;
  get getCollaborators(): string[];
  get getTasks(): string[];
  get getCreatedAt(): Date;
  get getUpdatedAt(): Date;
}
