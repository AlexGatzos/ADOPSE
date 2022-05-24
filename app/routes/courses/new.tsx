import { Form, Link, useLoaderData } from "@remix-run/react";

import { useUser } from "../../useUser";

import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { prisma } from "~/database";
import { getUser, requireUserId } from "~/session";
import tinyInvariant from "tiny-invariant";

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let userId = await requireUserId(request);

  let name = formData.get("name");

  //   if (!name) throw new Error("Test name must exist");
  tinyInvariant(typeof name === "string");

  await prisma.cource.create({
    data: {
      name,
    },
  });

  return {};
};

export const loader: LoaderFunction = async ({ request }) => {
  const courses = await prisma.cource.findMany();

  return json({
    courses,
  });
};

export default function New() {
  let { courses } = useLoaderData();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h2>New Course</h2>

      <Form method="post">
        <input name="name" required />
        <button type="submit">Create New Course</button>
      </Form>
      <ul className="course">
        {courses.map((course) => (
          <li>
            {course.id} {course.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
