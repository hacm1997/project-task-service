export interface TaskDto {
  title: string;
  description: string;
  dueDate: Date;
  project: string;
  assignedTo: string;
  collaborators: string[];
  status: 'todo' | 'in-progress' | 'completed' | 'all';
}
