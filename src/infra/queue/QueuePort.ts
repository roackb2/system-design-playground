
export interface QueueItem<T extends Record<string, any>> {
  id: string;
  payload: T
}

export abstract class QueuePort {
  abstract enqueue<T extends Record<string, any>>(queueName: string, item: QueueItem<T>): Promise<boolean>;
  abstract dequeue<T extends Record<string, any>>(queueName: string): Promise<QueueItem<T> | null>;
}
