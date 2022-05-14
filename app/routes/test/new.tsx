import { Form, Link, useLoaderData } from "@remix-run/react";

import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { prisma } from "~/database";
import { getUser, requireUserId } from "~/session";
import tinyInvariant from "tiny-invariant";
import { useState } from "react";

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();

  let title = formData.get("title");
  let course = formData.get("course");
  let questions = formData.getAll("questions");

  const userId = await requireUserId(request);

  tinyInvariant(typeof title === "string");
  tinyInvariant(typeof course === "string");

  await prisma.test.create({
    data: {
      title,
      questions: {
          connect: questions.map(id => ({ id: parseInt(id, 10) }))
      },
      user: {
          connect: {
              id: userId
          }
      },
      course: {
          connect: {
              id: parseInt(course, 10)
          }
      }
    },
  });

  return redirect('/test/user')
};

export const loader: LoaderFunction = async ({ request }) => {
  const courses = await prisma.cource.findMany();
  const questions = await prisma.question.findMany();

  return json({
    courses,
    questions
  });
};

export default function New() {
  let { courses, questions } = useLoaderData();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h2>New Test</h2>

      <Form method="post">
        <label>
          <span>Title</span>
          <input name="title" required />
        </label>
        <label>
          <span>Course</span>
          <select name="course">
            {courses.map((course) => {
              return (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              );
            })}
          </select>
        </label>

        <label>
          <span>Questions</span>

          <select multiple name="questions">
            {questions.map((question) => {
              return (
                <option key={question.id} value={question.id}>
                  {question.body}
                </option>
              );
            })}
          </select>
        </label>
        <button type="submit">Create New Test</button>
      </Form>
    </div>
  );
}
