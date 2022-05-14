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

  let body = formData.get("body");
  let course = formData.get("course");
  let answers = formData.getAll("answers");
  let correctAnswer = formData.get("correctAnswer");

  console.log("SERVER", { answers });
  const userId = await requireUserId(request);

  //   if (!name) throw new Error("Test name must exist");
  tinyInvariant(typeof body === "string");
  tinyInvariant(typeof course === "string");
  tinyInvariant(typeof correctAnswer === "string");

  await prisma.question.create({
    data: {
      body,
      answers: {
        create: answers.map((answer) => {
          tinyInvariant(typeof answer === "string");
          return {
            body: answer,
            isCorrect: answer === correctAnswer,
          };
        }),
      },
      user: {
        connect: {
          id: userId,
        },
      },
      cource: {
        connect: {
          id: parseInt(course, 10),
        },
      },
    },
  });

  return redirect("/questions/user");
};

export const loader: LoaderFunction = async ({ request }) => {
  const courses = await prisma.cource.findMany({
    include: {
      questions: {
        include: {
          answers: true,
        },
      },
    },
  });

  return json({
    courses,
  });
};

export default function New() {
  let { courses } = useLoaderData();
  let [answers, setAnswers] = useState([]);

  console.log({ answers });

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h2>New Question</h2>

      <Form method="post">
        <label>
          <span>Question</span>
          <input
            className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
            name="body"
            required
          />
        </label>
        <label>
          <span>Course</span>
          <select
            className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
            name="course"
          >
            {courses.map((course) => {
              return (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              );
            })}
          </select>
        </label>

        <select
          className="hidden"
          onChange={console.log}
          multiple
          name="answers"
          value={answers}
        >
          {answers.map((answer, i) => (
            <option key={i}>{answer}</option>
          ))}
        </select>
        <label>
          <span>Answers</span>

          <select
            className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
            name="correctAnswer"
          >
            {answers.map((answer, i) => (
              <option key={i}>{answer}</option>
            ))}
          </select>
        </label>
        <div>
          <input
            className="rounded border border-gray-500 px-2 py-1 text-lg"
            id="answer"
            placeholder="Add a new answer"
          />
          <button
            className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
            onClick={(e) => {
              e.preventDefault();

              let answer = document.getElementById("answer");

              console.log(answer.value);

              answer?.focus();

              setAnswers([...answers, answer.value]);
              answer.value = null;
            }}
            type="button"
          >
            +
          </button>
        </div>
        <button
          className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          type="submit"
        >
          Create New Question
        </button>
      </Form>
    </div>
  );
}
