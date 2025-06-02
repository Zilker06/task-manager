import { TodoClient } from '../clients/todo.client';
import { Task } from '../models/task';
import { FirebaseRepository } from '../repositories/firebase.repository';

export class TaskService {
  constructor(
    private todoClient: TodoClient,
    private firebaseRepo: FirebaseRepository
  ) {}

  async getAllTasks(): Promise<Task[]> {
    const externalTasks = await this.todoClient.getAll();
    return this.firebaseRepo.mergeTasks(externalTasks);
  }

  async getTaskById(id: string): Promise<Task> {
    const externalTask = await this.todoClient.getById(id).catch(() => null);
    if (externalTask) return externalTask;

    const firebaseTask = await this.firebaseRepo.getTaskById(id);
    if (!firebaseTask) throw new Error('Task not found');
    
    return firebaseTask;
  }

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const externalTask = await this.todoClient.create(task);
    return this.firebaseRepo.saveTask(externalTask);
  }

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    try {
      const updatedTask = await this.todoClient.update(id, task);
      return this.firebaseRepo.saveTask(updatedTask);
    } catch (error) {
      const existingTask = await this.firebaseRepo.getTaskById(id);
      if (!existingTask) throw new Error('Task not found');
      
      const updated = { ...existingTask, ...task };
      return this.firebaseRepo.saveTask(updated);
    }
  }

  async deleteTask(id: string): Promise<void> {
    await Promise.allSettled([
      this.todoClient.delete(id).catch(() => {}),
      this.firebaseRepo.deleteTask(id)
    ]);
  }
}