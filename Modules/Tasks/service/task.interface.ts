export interface TaskBaseInterface {
  get getId(): string;
  get getTitle(): string;
  get getDescription(): string;
  get getDueDate(): Date;
  get getStatus(): string;
  get getProject(): string;
  get getAssignedTo(): string;
  get getCollaborators(): string[];
}
