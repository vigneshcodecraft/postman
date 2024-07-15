import { Publisher } from "./pub-sub";

export type ModelStatusType = "pending" | "available" | "failure";
export class ModelStatus {
  private modelStatus: ModelStatusType = "pending";
  private publisher: Publisher;
  constructor(publisher: Publisher) {
    this.publisher = publisher;
  }
  setModelStatus(modelStatus: ModelStatusType): void {
    this.modelStatus = modelStatus;
    this.publisher.updateSubscribers();
  }
  getModelStatus() {
    return this.modelStatus;
  }
}

export type ViewStatusType = "view" | "hide";
export class ViewStatus {
  private viewStatus: ViewStatusType = "hide";
  private publisher: Publisher;
  constructor(publisher: Publisher) {
    this.publisher = publisher;
  }
  setViewStatus(viewStatus: ViewStatusType): void {
    this.viewStatus = viewStatus;
    this.publisher.updateSubscribers();
  }
  getViewStatus() {
    return this.viewStatus;
  }
}
