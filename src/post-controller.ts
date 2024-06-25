import { PostsManager, Post } from "./post-model";
import { PostsView } from "./post-view";

export class PostsController {
  constructor(postView: PostsView, postManager: PostsManager) {
    function handlePrevious(): void {
      console.log("prev");
      postManager.prevousPostIndex();
    }
    function handleNext(): void {
      console.log("next");
      postManager.nextPostIndex();
    }
    // we need to add post view as a subscriber to model
    postManager.subscribe(postView);
    // setup event handlers for prev and next buttons.
    postView.nextButton?.addEventListener("click", handleNext);
    postView.prevButton?.addEventListener("click", handlePrevious);
    postManager.setModelStatus("pending");
    postManager.updateSubscribers();
    this.fetchPosts()
      .then((posts) => postManager.setPosts(posts))
      .catch(() => {
        postManager.setModelStatus("failure");
        postManager.updateSubscribers();
      });
  }
  async fetchPosts(): Promise<Post[]> {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const posts = (await response.json()) as Post[];
      const delay = (timeout: number) =>
        new Promise((resolve) => setTimeout(resolve, timeout));

      await delay(5000);
      return posts;
    } catch {
      throw new Error("Could not fetch for now, please try again later");
    }
  }
}
