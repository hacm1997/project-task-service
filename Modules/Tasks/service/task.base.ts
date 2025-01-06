import { v4 as uuidv4 } from 'uuid';
import { TaskBaseInterface } from './task.interface';

export class TaskBase implements TaskBaseInterface {
  private id: string;
  private title: string;
  private description: string;
  private dueDate: Date;
  private status: 'all' | 'in-progress' | 'completed';
  private project: string;
  private assignedTo: string;
  private collaborators: string[];

  constructor(
    title: string,
    description: string,
    dueDate: Date,
    project: string,
    assignedTo: string,
    collaborators: string[] = [],
    status: 'all' | 'in-progress' | 'completed' = 'all',
  ) {
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.status = status;
    this.project = project;
    this.assignedTo = assignedTo;
    this.collaborators = collaborators;
  }

  get getId(): string {
    return this.id;
  }

  get getTitle(): string {
    return this.title;
  }

  set setTitle(title: string) {
    this.title = title;
  }

  get getDescription(): string {
    return this.description;
  }

  set setDescription(description: string) {
    this.description = description;
  }

  get getDueDate(): Date {
    return this.dueDate;
  }

  set setDueDate(dueDate: Date) {
    this.dueDate = dueDate;
  }

  get getStatus(): 'all' | 'in-progress' | 'completed' {
    return this.status;
  }

  set setStatus(status: 'all' | 'in-progress' | 'completed') {
    this.status = status;
  }

  get getProject(): string {
    return this.project;
  }

  set setProject(project: string) {
    this.project = project;
  }

  get getAssignedTo(): string {
    return this.assignedTo;
  }

  set setAssignedTo(user: string) {
    this.assignedTo = user;
  }

  get getCollaborators(): string[] {
    return this.collaborators;
  }
}
