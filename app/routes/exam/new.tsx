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

  let test = formData.get("test");

  const userId = await requireUserId(request);

  tinyInvariant(typeof test === "string");

  let exam = await prisma.exam.create({
    data: {
      score: 0,
      status: 'new',
      test: {
        connect: {
          id: parseInt(test, 10)
        }
      },
      user: {
          connect: {
              id: userId
          }
      },
      
    },
  });

  return redirect(`/exam/${exam.id}`)
};

export const loader: LoaderFunction = async ({ request }) => {
  const tests = await prisma.test.findMany();

  return json({
    tests
  });
};

export default function New() {
  let { tests } = useLoaderData();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h2>Select a Test</h2>

      <Form method="post">
        <label>
          <span>Test</span>
          <select name="test">
            {tests.map((test) => {
              return (
                <option key={test.id} value={test.id}>
                  {test.title}
                </option>
              );
            })}
          </select>
        </label>

        <button type="submit">Begin Exam</button>
      </Form>
    </div>
  );
}
