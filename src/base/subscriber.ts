import { Stan, Message } from "node-nats-streaming";
import { EventData } from './event-data'

export abstract class Subscriber<T extends EventData> {

  abstract subject: string;
  abstract queueGroupName: string;

  protected ackWait: number = 5 * 1000;
  
  constructor(private client: Stan) {}

  getSubscriberOptions() {
    return this.client
    .subscriptionOptions()
    .setManualAckMode(true)
    .setAckWait(this.ackWait)
    .setDurableName(this.queueGroupName)
    // .setDeliverAllAvailable() // Todas as mensagens irão retornar a fila
  }
  

  sub() {
    const sub = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.getSubscriberOptions()
    )

    sub.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`)
      this.onMessage(this.parseMessage(msg), msg)
    });
  }

  parseMessage(msg: Message): T {
    const data = msg.getData()
    return JSON.parse(typeof data === 'string' ? data : data.toString('utf-8'))
  }


  abstract onMessage(data: T, msg: Message): void;
}

