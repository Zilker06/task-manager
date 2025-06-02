import axios from 'axios';
import { Task } from '../models/task';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

export class TodoClient {
  async getAll(): Promise<Task[]> {
    const response = await axios.get(API_URL);
    return response.data.map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      completed: item.completed,
      description: '',
    }));
  }

  async getById(id: string): Promise<Task> {
    const response = await axios.get(`${API_URL}/${id}`);
    return {
      id: response.data.id.toString(),
      title: response.data.title,
      completed: response.data.completed,
      description: '',
    };
  }

  async create(task: Omit<Task, 'id'>): Promise<Task> {
    const response = await axios.post(API_URL, task);
    return {
      id: response.data.id.toString(),
      title: response.data.title,
      completed: response.data.completed,
      description: '',
    };
  }

  async update(id: string, task: Partial<Task>): Promise<Task> {
    const response = await axios.put(`${API_URL}/${id}`, task);
    return {
      id: response.data.id.toString(),
      title: response.data.title,
      completed: response.data.completed,
      description: '',
    };
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  }
}