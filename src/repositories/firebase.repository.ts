import admin from 'firebase-admin';
import { Task } from '../models/task';

export class FirebaseRepository {
  private db: admin.firestore.Firestore;
  private tasksCollection: admin.firestore.CollectionReference;

  constructor() {
    // La inicialización de Firebase se mueve al index.ts principal
    this.db = admin.firestore();
    this.tasksCollection = this.db.collection('tasks');
  }

  async saveTask(task: Task): Promise<Task> {
    const taskRef = task.id ? this.tasksCollection.doc(task.id) : this.tasksCollection.doc();
    const taskToSave = {
      ...task,
      id: taskRef.id,
      createdAt: task.createdAt || admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await taskRef.set(taskToSave);
    const savedDoc = await taskRef.get();
    const data = savedDoc.data();
    if (!data) throw new Error('Failed to fetch saved task');
    return {
      id: savedDoc.id,
      title: data.title,
      description: data.description,
      completed: data.completed,
      createdAt: data.createdAt?.toDate?.() ?? undefined,
      updatedAt: data.updatedAt?.toDate?.() ?? undefined
    } as Task;
  }

  async getTaskById(id: string): Promise<Task | null> {
    const doc = await this.tasksCollection.doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } as Task : null;
  }

  async getAllTasks(): Promise<Task[]> {
    const snapshot = await this.tasksCollection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
  }

  async deleteTask(id: string): Promise<void> {
    await this.tasksCollection.doc(id).delete();
  }

  async mergeTasks(externalTasks: Task[]): Promise<Task[]> {
    const firebaseTasks = await this.getAllTasks();
    const mergedTasks = [...externalTasks];
    
    firebaseTasks.forEach(fbTask => {
      if (!mergedTasks.some(t => t.id === fbTask.id)) {
        mergedTasks.push(fbTask);
      }
    });

    return mergedTasks;
  }
}