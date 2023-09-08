import { hash } from "argon2";

export default eventHandler(async (event) => {
  try {
    const body = await readBody<{
      name: string;
      email: string;
      password: string;
    }>(event);

    console.log(body);

    const prisma = usePrisma();

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: await hash(body.password),
      },
    });

    return { success: true, user };
  } catch (error) {
    return { success: false };
  }
});
