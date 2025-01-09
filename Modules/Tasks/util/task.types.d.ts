export type TaskQuery = Partial<{
  title: RegExp;
  project: string;
  description?: RegExp;
}>;
