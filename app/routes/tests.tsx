import { Form, Link, useLoaderData } from "@remix-run/react";

import { useUser } from "../useUser";

import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { prisma } from "~/database";
import { getUser, requireUserId } from "~/session";

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let userId = await requireUserId(request);

  let name = formData.get("name");

  if (!name) throw new Error("Test name must exist");

  await prisma.test.create({
    data: {
      title: name,
      user: {
        connect: {
          id: parseInt(userId, 10),
        },
      },
    },
  });

  return {};
};

export const loader: LoaderFunction = async ({ request }) => {
  let user = await getUser(request);
  const tests = await prisma.test.findMany({
    where: {
      userId: user?.id,
    },
  });
  return json({
    tests,
  });
};

export default function Tests() {
  let user = useUser();
  let {tests} = useLoaderData();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h2>Tests</h2>

      <Form method="post">
        <input name="name" required />
        <button type="submit">Create New Test</button>
      </Form>
      <ul>
        {tests.map((test) => <li>{test.id} {test.title}</li>)}
      </ul>
    </div>
  );
}
