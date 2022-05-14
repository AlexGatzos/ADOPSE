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

export let action: ActionFunction = async ({ request, params }) => {
  let formData = await request.formData();
  console.log(params.id)

  const exam = await prisma.exam.findUnique({
    where: {
      id: parseInt(params.id, 10),
    },
    include: {
      test: {
        include: {
          questions: {
            include: {
              answers: true,
            },
          },
        },
      },
    },
  });

  let test = exam?.test;

  const userId = await requireUserId(request);
  console.log(userId === exam?.userid)
  tinyInvariant(userId === exam?.userid);

  let score = 0;

  for (let [questionId, answerId] of formData.entries()) {
    console.log({questionId, answerId})
    tinyInvariant(typeof questionId === "string");
    tinyInvariant(typeof answerId === "string");

    const question = exam?.test.questions.find(
      (q) => q.id === parseInt(questionId, 10)
    );

    console.log(question);

    const correctAnswer = question?.answers.find((a) => a.isCorrect);

    if (parseInt(answerId, 10) === correctAnswer?.id) {
      const qlength = exam?.test.questions.length || 1;

      score += (1 / qlength) * 100;
    }
  }

  console.log(score);

  await prisma.exam.update({
    where: {
      id: exam?.id,
    },
    data: {
      score,
      status: "completed",
    },
  });

  return redirect(`/exam/user`);
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const exam = await prisma.exam.findUnique({
    where: {
      id: parseInt(params.id, 10),
    },
    include: {
      test: {
        include: {
          questions: {
            include: {
              answers: {
                select: {
                  body: true,
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return json({
    exam,
  });
};

export default function Exam() {
  let { exam } = useLoaderData();
  let test = exam.test;
  let questions = test.questions;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h2>Select a Test</h2>

      <Form method="post">
        {questions.map((question) => {
          let { answers } = question;

          return (
            <div key={question.id}>
              <div>{question.body}</div>
              <select name={question.id}>
                {answers.map((answer) => {
                  return <option key={answer.id} value={answer.id}>{answer.body}</option>;
                })}
              </select>
            </div>
          );
        })}

        <button type="submit">Finish Exam</button>
      </Form>
    </div>
  );
}
