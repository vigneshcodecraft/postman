import { z } from "zod";

test("zod tests", () => {
  const userSchema = z.object({
    // User Id should not be also 50 and 75
    userId: z
      .number()
      .min(1)
      .max(10000)
      .refine((val) => val !== 50 && val !== 75, {
        message: "userId can not be 50 or 75 and must be within 1 and 10000",
      }),
    id: z.number().gt(100),
    name: z.string().min(5).max(50).trim().toLowerCase(),
    gender: z
      .union([z.literal("f"), z.literal("m")])
      .transform((val) => ({ f: "female", m: "male" }[val])),
    body: z.string(),
  });

  type User = z.infer<typeof userSchema>;

  const user: User = {
    userId: 51,
    id: 191,
    name: "Vignesh",
    gender: "m",
    body: "some stuff",
  };
  console.log(user);
  //   expect(() => userSchema.parse(user)).toThrow();

  const parsedUser = userSchema.safeParse(user);
  console.log(parsedUser.error?.flatten());
  //   type Expect<T, U> = T extends U ? true : false;
  console.log(parsedUser);
});
