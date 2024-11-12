export interface Task {
  id: string,
  isDone: boolean
}

export interface Homework {
  tasks: Task[]
}