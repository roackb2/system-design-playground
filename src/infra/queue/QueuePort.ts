
export interface QueueItem {
  id: string;
  payload: Record<string, any>
}

export abstract class QueuePort {
  abstract enqueue(item: QueueItem): Promise<boolean>;
  abstract dequeue(): Promise<QueueItem | null>;
}
