import { z } from "zod";
export async function fetchData<T extends z.ZodTypeAny, D>(
  url: string,
  schema: T
): Promise<D> {
  try {
    const response = await fetch(url);
    const posts = (await response.json()) as D;
    const delay = (timeout: number) =>
      new Promise((resolve) => setTimeout(resolve, timeout));

    await delay(2000);
    return posts;
  } catch (error: unknown) {
    throw new Error("Could not fetch comments, please try again later");
  }
}
