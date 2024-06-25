import { PostsView } from "./post-view";
import { PostsManager } from "./post-model";
import { PostsController } from "./post-controller";

// controller is yer to be created;
const postView = new PostsView();
const postManager = new PostsManager();
const postController = new PostsController(postView, postManager);
postController.fetchPosts();
postManager.subscribe(postView);
// create the view, model, and controller and setup the relationship between them.
// const postController = new PostsController(postView, postManager);
