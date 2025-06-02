import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task';

export class TaskController {
  constructor(private taskService: TaskService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const task = await this.taskService.getTaskById(req.params.id);
      if (task) {
        res.json(task);
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching task' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const newTask = await this.taskService.createTask(req.body);
      res.status(201).json(newTask);
    } catch (error) {
      res.status(400).json({ message: 'Error creating task' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const updatedTask = await this.taskService.updateTask(req.params.id, req.body);
      res.json(updatedTask);
    } catch (error) {
      res.status(400).json({ message: 'Error updating task' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await this.taskService.deleteTask(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: 'Error deleting task' });
    }
  }
}