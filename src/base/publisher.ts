import { Stan } from "node-nats-streaming";
import { EventData } from './event-data'

export abstract class Publisher<T extends EventData> {
  
  abstract subject: string;

  constructor(private client: Stan) {}
  
  pub(data: T): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data || {}), (err) => {
        if (err) {
          console.log(err)
          return reject(err)
        }

        console.log('Event published to subject', this.subject)
        resolve()
      })
    })
  }
}