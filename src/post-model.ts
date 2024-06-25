// the model layer should have an array of posts
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}
export interface PostsModel {
  posts: Post[];
  currentPostIndex: number;
  currentPost: () => Post | undefined;
  setModelStatus: (modelStatus: ModelStatus) => void;
  getModelStatus: () => ModelStatus;
}

export interface CommentsModel {
  commentsMap: Map<number, Comment[]>;
  setCommentsForPost: (comments: Comment[], postId: number) => void;
  getCommentsForPost: (postId: number) => Comment[] | undefined;
}

export interface Subscriber {
  update: (Publisher: Publisher) => void;
}

export interface Publisher {
  subscribers: Subscriber[];
  subscribe: (subscriber: Subscriber) => void;
  unsubscribe: (subscriber: Subscriber) => void;
  updateSubscribers: () => void;
}

export type ModelStatus = "pending" | "available" | "failure";

export class PostsManager implements PostsModel, Publisher {
  public currentPostIndex: number = 0;
  public posts: Post[] = [];
  public subscribers: Subscriber[] = [];
  private modelStatus: ModelStatus = "pending";
  // states in which model can be in
  // 1. pending
  // 2. available
  // 3. failure
  //
  currentPost(): Post | undefined {
    return this.posts[this.currentPostIndex];
  }

  subscribe(subscriber: Subscriber): void {
    if (!this.subscribers.includes(subscriber))
      this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: Subscriber): void {
    this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
  }

  updateSubscribers(): void {
    this.subscribers.forEach((subscriber) => subscriber.update(this));
  }

  setPosts(posts: Post[]) {
    this.posts = posts;
    this.modelStatus = "available";
    this.updateSubscribers();
  }

  getPosts() {
    return this.posts;
  }
  nextPostIndex() {
    if (this.currentPostIndex !== this.posts.length - 1) {
      this.currentPostIndex++;
      this.updateSubscribers();
    }
  }
  prevousPostIndex() {
    if (this.currentPostIndex > 0) {
      this.currentPostIndex--;
      this.updateSubscribers();
    }
    return null;
  }

  setModelStatus(modelStatus: ModelStatus): void {
    this.modelStatus = modelStatus;
  }
  getModelStatus() {
    return this.modelStatus;
  }
}

export class CommentsManager implements CommentsModel {
  commentsMap: Map<number, Comment[]> = new Map();
  setCommentsForPost(comments: Comment[], postId: number) {
    this.commentsMap.set(postId, comments);
  }

  getCommentsForPost(postId: number) {
    return this.commentsMap.get(postId);
  }
}
