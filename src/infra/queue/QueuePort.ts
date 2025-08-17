
export interface QueueItem {
  id: string;
  payload: Record<string, any>
}

export abstract class QueuePort {
  abstract enqueue(queueName: string, item: QueueItem): Promise<boolean>;
  abstract dequeue(queueName: string): Promise<QueueItem | null>;
}
