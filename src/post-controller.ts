import {
  PostsManager,
  CommentsManager,
  commentArraySchema,
} from "./post-model";
import { PostsView } from "./post-view";
import { getComment, getPost } from "./service";

export class PostsController {
  constructor(
    postView: PostsView,
    postManager: PostsManager,
    commentManager: CommentsManager
  ) {
    function handlePrevious(): void {
      postManager.previousPostIndex();
      commentManager.viewStatus.setViewStatus("hide");
    }

    function handleNext(): void {
      postManager.nextPostIndex();
      commentManager.viewStatus.setViewStatus("hide");
    }

    function handleView(): void {
      if (commentManager.viewStatus.getViewStatus() === "hide") {
        commentManager.viewStatus.setViewStatus("view");
        fetchCommentsForCurrentPost();
      } else {
        commentManager.viewStatus.setViewStatus("hide");
      }
    }

    function handleSearch(): void {
      const searchInput = postView.searchInput?.value;
      console.log(searchInput);
      if (searchInput !== undefined && !Number.isNaN(searchInput)) {
        postManager.setCurrentPost(Number(searchInput));
        postManager.updateSubscribers();
      } else {
        alert("Post Not Found");
      }
    }
    const fetchCommentsForCurrentPost = () => {
      commentManager.modelStatus.setModelStatus("pending");
      const currentPost = postManager.currentPost();
      if (currentPost) {
        if (commentManager.getCommentsForPost(currentPost.id)) {
          commentManager.modelStatus.setModelStatus("available");
        } else {
          commentManager.setCurrentPostId(currentPost.id);
          getComment(currentPost.id)
            .then((comments) =>
              commentManager.setCommentsForPost(comments, currentPost.id)
            )
            .catch(() => {
              commentManager.modelStatus.setModelStatus("failure");
            });
        }
      }
    };

    // we need to add post view as a subscriber to model
    postManager.subscribe(postView);
    commentManager.subscribe(postView);
    // setup event handlers for prev and next buttons.
    postView.nextButton?.addEventListener("click", handleNext);
    postView.prevButton?.addEventListener("click", handlePrevious);
    postView.viewButton?.addEventListener("click", handleView);
    postView.searchButton?.addEventListener("click", handleSearch);
    // setup status of post and comment
    postManager.modelStatus.setModelStatus("pending");

    getPost()
      .then((posts) => postManager.setPosts(posts))
      .catch(() => {
        postManager.modelStatus.setModelStatus("failure");
        postManager.updateSubscribers();
      });
  }
}
