
export interface QueueItem<T extends Record<string, any>> {
  id: string;
  payload: T
}

export abstract class QueuePort {
  abstract enqueue<T extends Record<string, any>>(queueName: string, item: QueueItem<T>): Promise<boolean>;
  abstract dequeue<T extends Record<string, any>>(queueName: string): Promise<QueueItem<T> | null>;
}

export abstract class IntegrationOperationPort {
  // noop
}

// Credential management across all org
export abstract class IntegrationCredentialManagerPort {
  abstract loadCredential(): Promise<string>;
  abstract clearCache(): Promise<void>;
}




class JiraOperationService implements IntegrationOperationPort {
  private instance: AxiosInstance;

  private buildAxiosOptions({
    authType,
    axiosOptions
  }: {
    authType: 'pat'
    axiosOptions: string
  }): AxiosRequestConfig {
    if (authType === 'pat') {
      const credential = await CustomerIntegrationService.injectCredential();
    }
  }

  getInstance({
    authType,
    axiosOptions
  }: {
    authType: 'pat'
    axiosOptions: string
  }): Promise<AxiosInstance> {
    return this.axiosInstance;
  } {

    if (authType === 'pat') {
      const credential = await
    }

    const axiosInstance = axios.create({
      baseURL: 'https://api.jira.com',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    })
  }

  getIssue(issueId: string): Promise<IssueType> {

  }

}
