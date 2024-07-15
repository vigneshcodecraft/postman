import { PostsView } from "./post-view";
import { PostsManager, CommentsManager } from "./post-model";
import { PostsController } from "./post-controller";

// controller is yet to be created;
const postView = new PostsView();
const postManager = new PostsManager();
const commentManager = new CommentsManager();
new PostsController(postView, postManager, commentManager);
postManager.subscribe(postView);
commentManager.subscribe(postView);
// create the view, model, and controller and setup the relationship between them.
// const postController = new PostsController(postView, postManager);
