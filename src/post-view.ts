import "./style.css";
import "./posts.css";
import { PostsManager, Publisher, Subscriber } from "./post-model";
export class PostsView implements Subscriber {
  postTitleElement: HTMLHeadingElement | null = null;
  postDescription: HTMLParagraphElement | null = null;
  prevButton: HTMLButtonElement | null = null;
  nextButton: HTMLButtonElement | null = null;
  constructor() {
    document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
  <section>
  <nav>
    <button data-testid="prev-button">Previous</button>
    <h2></h2>
    <button data-testid="next-button">Next</button>
  </nav>
  <p class="post-desc" data-testid="post-desc"></p>
  </section>
  <section>
  <button class="">View Comments</button>
  <p class="comments">Comments of current post go there</p>
  </section>
  </div>
`;
    this.postTitleElement = document.querySelector("h2");
    this.postDescription = document.querySelector('[data-testid="post-desc"]');
    this.prevButton = document.querySelector('[data-testid="prev-button"]');
    this.nextButton = document.querySelector('[data-testid="next-button"]');
  }
  update(manager: Publisher) {
    if (manager instanceof PostsManager) {
      // Check if model is in available state, if so we are good to consume the posts data
      // on the other hand, if the status is pending, that means, someone
      // has initiated a data fetch, but the data has arrived yet.
      // in this case, we would like to let user know about the progress.
      // in
      const post = manager.currentPost();
      switch (manager.getModelStatus()) {
        case "available":
          if (this.postTitleElement !== null) {
            this.postTitleElement.textContent =
              post?.title ?? "title is missing";
          }
          if (this.postDescription) {
            this.postDescription.textContent = post?.body ?? "body is missing";
          }
          break;
        case "pending":
          if (this.postTitleElement !== null) {
            this.postTitleElement.textContent = post?.title ?? "Loading.....";
          }
          if (this.postDescription) {
            this.postDescription.textContent = post?.body ?? "Loading.....";
          }
          break;
        case "failure":
          if (this.postTitleElement !== null) {
            this.postTitleElement.textContent = "data not found try again";
          }
          if (this.postDescription) {
            this.postDescription.textContent = "data not found try again";
          }
          break;
      }
    }
  }
}
