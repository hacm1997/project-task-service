import { v4 as uuidv4 } from 'uuid';

export class ProjectBase {
  private id: string;
  private name: string;
  private description: string;
  private owner: string; // Id usuario original name
  private collaborators: string[]; // Id's collaborators
  private tasks: string[]; // Id's tasks associated with this project
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    name: string,
    description: string,
    owner: string,
    collaborators: string[] = [],
    tasks: string[] = [],
  ) {
    this.id = uuidv4();
    this.name = name;
    this.description = description;
    this.owner = owner;
    this.collaborators = collaborators;
    this.tasks = tasks;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  get getId(): string {
    return this.id;
  }

  get getName(): string {
    return this.name;
  }

  get getDescription(): string {
    return this.description;
  }

  get getOwner(): string {
    return this.owner;
  }

  get getCollaborators(): string[] {
    return this.collaborators;
  }

  get getTasks(): string[] {
    return this.tasks;
  }

  get getCreatedAt(): Date {
    return this.createdAt;
  }

  get getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Collaborators Management
  addCollaborator(collaboratorId: string): void {
    if (!this.collaborators.includes(collaboratorId)) {
      this.collaborators.push(collaboratorId);
      this.updatedAt = new Date();
    }
  }

  removeCollaborator(collaboratorId: string): void {
    this.collaborators = this.collaborators.filter(
      (id) => id !== collaboratorId,
    );
    this.updatedAt = new Date();
  }

  // Task management
  addTask(taskId: string): void {
    if (!this.tasks.includes(taskId)) {
      this.tasks.push(taskId);
      this.updatedAt = new Date();
    }
  }

  removeTask(taskId: string): void {
    this.tasks = this.tasks.filter((id) => id !== taskId);
    this.updatedAt = new Date();
  }

  updateProject(name?: string, description?: string): void {
    if (name) this.name = name;
    if (description) this.description = description;
    this.updatedAt = new Date();
  }
}