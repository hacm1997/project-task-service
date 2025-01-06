import { CommentBaseInterface } from './comment.interface';

export class CommentBase implements CommentBaseInterface {
  private content: string;
  private user_name: string;
  private task: string;
  private author: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    content: string,
    user_name: string,
    task: string,
    author: string,
  ) {
    this.content = content;
    this.user_name = user_name;
    this.task = task;
    this.author = author;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  get getContent(): string {
    return this.content;
  }
  get getUserName(): string {
    return this.user_name;
  }
  get getTask(): string {
    return this.task;
  }
  get getAuthor(): string {
    return this.author;
  }
  get getCreatedAt(): Date {
    return this.createdAt;
  }
  get getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
