// post-model.ts
import { z } from "zod";
import { ModelStatus, ViewStatus } from "./model-status";
import { ActualPublisher } from "./pub-sub";

export const postSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

export const commentSchema = z.object({
  postId: z.number(),
  id: z.number(),
  name: z.string(),
  email: z.string(),
  body: z.string(),
});

export const postArraySchema = z.array(postSchema);

export const commentArraySchema = z.array(commentSchema);

export type Post = z.infer<typeof postSchema>;

export type Comment = z.infer<typeof commentSchema>;

export interface PostsModel {
  posts: Post[];
  currentPostIndex: number;
  currentPost: () => Post | undefined;
  setPosts: (posts: Post[]) => void;
  previousPostIndex: () => void;
  nextPostIndex: () => void;
  getPosts: () => Post[];
  setCurrentPost: (postId: number) => void;
}

export interface CommentsModel {
  commentsMap: Map<number, Comment[]>;
  setCommentsForPost: (comments: Comment[], postId: number) => void;
  getCommentsForPost: (postId: number) => Comment[] | undefined;
  setCurrentPostId: (postId: number) => void;
  getCurrentPostId: () => number | null;
}

export class PostsManager extends ActualPublisher implements PostsModel {
  public currentPostIndex: number = 0;
  public posts: Post[] = [];
  public modelStatus: ModelStatus = new ModelStatus(this);
  currentPost(): Post | undefined {
    return this.posts[this.currentPostIndex];
  }

  setCurrentPost(postId: number): Post | undefined {
    if (this.posts[postId - 1]) {
      this.currentPostIndex = postId - 1;
      return this.posts[this.currentPostIndex];
    }
    alert("Post not found!!!");
  }

  setPosts(posts: Post[]) {
    this.posts = posts;
    this.modelStatus.setModelStatus("available");
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

  previousPostIndex() {
    if (this.currentPostIndex > 0) {
      this.currentPostIndex--;
      this.updateSubscribers();
    }
  }
}

export class CommentsManager extends ActualPublisher implements CommentsModel {
  commentsMap: Map<number, Comment[]> = new Map();
  private currentPostId: number | null = null;
  public modelStatus: ModelStatus = new ModelStatus(this);
  public viewStatus: ViewStatus = new ViewStatus(this);

  setCommentsForPost(comments: Comment[], postId: number) {
    this.commentsMap.set(postId, comments);
    this.modelStatus.setModelStatus("available");
    this.updateSubscribers();
  }

  getCommentsForPost(postId: number): Comment[] | undefined {
    return this.commentsMap.get(postId);
  }

  setCurrentPostId(postId: number) {
    this.currentPostId = postId;
    this.updateSubscribers();
  }

  getCurrentPostId(): number | null {
    return this.currentPostId;
  }
}
