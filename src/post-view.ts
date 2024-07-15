import "./style.css";
import "./posts.css";
import { CommentsManager, PostsManager } from "./post-model";
import { Publisher, Subscriber } from "./pub-sub";

export class PostsView implements Subscriber {
  postTitleElement: HTMLHeadingElement | null = null;
  postDescription: HTMLParagraphElement | null = null;
  prevButton: HTMLButtonElement | null = null;
  nextButton: HTMLButtonElement | null = null;
  viewButton: HTMLButtonElement | null = null;
  commentsElement: HTMLParagraphElement | null = null;
  commentsVisible: boolean = false;
  postNumber: HTMLSpanElement | null = null;
  searchButton: HTMLButtonElement | null = null;
  searchInput: HTMLInputElement | null = null;

  constructor() {
    document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
  <div class="search-container">
  <input name="search-input" class="search" type="text" placeholder="Search Post"/>
  <button class="search-button">Search</button>
  </div>
  <section> 
  <p class='page-css'><span class="page-number"></span><p>
  <nav>
    <button class="left-button" data-testid="prev-button">Previous</button>
    <h2></h2>
    <button class="right-button" data-testid="next-button">Next</button>
  </nav>
  <p class="post-desc" data-testid="post-desc"></p>
  </section>
  <section>
  <button class="view-comments" data-testid="view-button">View Comments</button>
  <p class="comments"></p>
  </section>
  </div>
`;
    this.postTitleElement = document.querySelector("h2");
    this.postDescription = document.querySelector('[data-testid="post-desc"]');
    this.prevButton = document.querySelector('[data-testid="prev-button"]');
    this.nextButton = document.querySelector('[data-testid="next-button"]');
    this.commentsElement = document.querySelector(".comments");
    this.viewButton = document.querySelector('[data-testid="view-button"]');
    this.postNumber = document.querySelector(".page-number");
    this.searchButton = document.querySelector(".search-button");
    this.searchInput = document.querySelector('input[name="search-input"]');
  }
  update(manager: Publisher) {
    if (manager instanceof PostsManager) {
      // Check if model is in available state, if so we are good to consume the posts data
      // on the other hand, if the status is pending, that means, someone
      // has initiated a data fetch, but the data has arrived yet.
      // in this case, we would like to let user know about the progress.
      // in

      const post = manager.currentPost();
      switch (manager.modelStatus.getModelStatus()) {
        case "available":
          if (this.postTitleElement !== null) {
            this.postTitleElement.textContent =
              post?.title ?? "title is missing";
          }
          if (this.postDescription) {
            this.postDescription.textContent = post?.body ?? "body is missing";
          }
          if (this.prevButton) {
            this.prevButton.disabled = manager.currentPostIndex === 0;
          }
          if (this.nextButton) {
            this.nextButton.disabled =
              manager.currentPostIndex === manager.posts.length - 1;
          }
          if (this.postNumber) {
            this.postNumber.textContent = `Post ${
              manager.currentPostIndex + 1
            } of ${manager.posts.length}`;
            console.log(this.postNumber.textContent);
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

    if (manager instanceof CommentsManager) {
      const currentPostId = manager.getCurrentPostId();
      switch (manager.modelStatus.getModelStatus()) {
        case "available":
          if (this.commentsElement && currentPostId !== null) {
            const comments = manager.getCommentsForPost(currentPostId);
            this.commentsElement.innerHTML = comments
              ? comments
                  .map(
                    (comment) =>
                      `<p><b>${comment.email}</b></p><p> ${comment.body}</p><br>`
                  )
                  .join("")
              : "";
          }
          break;
        case "pending":
          if (this.commentsElement) {
            this.commentsElement.innerHTML = "Loading.....";
          }
          break;
        case "failure":
          if (this.commentsElement) {
            this.commentsElement.innerHTML = "data not found";
          }
          break;
      }

      switch (manager.viewStatus.getViewStatus()) {
        case "hide":
          if (this.commentsElement) {
            this.commentsElement.style.display = "none";
          }
          if (this.viewButton) {
            this.viewButton.textContent = "View Comments";
          }
          break;
        case "view":
          if (this.commentsElement) {
            this.commentsElement.style.display = "block";
          }
          if (this.viewButton) {
            this.viewButton.textContent = "Hide Comments";
          }
          break;
      }
    }
  }
}
