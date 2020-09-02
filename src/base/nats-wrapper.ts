import nats, { Stan } from "node-nats-streaming"


export enum NatsProtocolSuppors { 'HTTP' = 'http'}

interface NatsWrapperConnectOptions {
  config: {
    protocol: NatsProtocolSuppors,
    host: string,
    port: number
  }
}

class NatsWrapper {
  private _client?: Stan

  connect(clusterId: string, clientId: string, options: NatsWrapperConnectOptions): Promise<Stan > {    
    return new Promise((resolve, reject) => {
      if (!this._client) {

        this._client = nats.connect(clusterId, clientId, {
          url: `${options.config.protocol}://${options.config.host}:${options.config.port}`
        })

        this._client!.on('connect', () => resolve(this._client));
        this._client!.on('error', error => reject(error))

      } else {
        resolve(this._client)
      }
    })
  }


  get client(): Stan {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting")
    }

    return this._client;
  }
}


export const natsWrapper = new NatsWrapper()