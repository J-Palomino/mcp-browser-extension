export interface SocketMessageMap {
  navigate: { url: string };
  click: { selector: string };
  type: { selector: string; text: string };
  screenshot: { selector?: string };
  getContent: { selector?: string };
  [key: string]: any;
}