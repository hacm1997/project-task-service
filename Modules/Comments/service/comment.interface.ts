export interface CommentBaseInterface {
  get getContent(): string;
  get getUserName(): string;
  get getTask(): string;
  get getAuthor(): string;
  get getCreatedAt(): Date;
  get getUpdatedAt(): Date;
}
