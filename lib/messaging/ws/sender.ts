import { WebSocket } from "ws";
import { BaseMessage } from "../types";

export function createSocketMessageSender<T>(ws: WebSocket) {
  return {
    sendSocketMessage: async (
      type: keyof T,
      payload: any,
      options: { timeoutMs?: number } = {}
    ): Promise<any> => {
      return new Promise((resolve, reject) => {
        const message: BaseMessage = {
          id: Math.random().toString(36),
          type: type as string,
          payload
        };

        const timeout = setTimeout(() => {
          reject(new Error("Message timeout"));
        }, options.timeoutMs || 30000);

        const messageHandler = (data: any) => {
          try {
            const response = JSON.parse(data.toString());
            if (response.id === message.id) {
              clearTimeout(timeout);
              ws.off("message", messageHandler);
              resolve(response.payload);
            }
          } catch (e) {
            // Ignore parsing errors
          }
        };

        ws.on("message", messageHandler);
        ws.send(JSON.stringify(message));
      });
    }
  };
}