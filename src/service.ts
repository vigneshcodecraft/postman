import { fetchData } from "./network";
import { postArraySchema, commentArraySchema, Post } from "./post-model";

export async function getPost() {
  return fetchData<typeof postArraySchema, Post[]>(
    "https://c8dc4f8b-b113-460f-84c2-8fb51298ada0.mock.pstmn.io/posts",
    postArraySchema
  );
}

export async function getComment(postId: number) {
  return fetchData<typeof commentArraySchema, Comment[]>(
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`,
    commentArraySchema
  );
}
