import { Form, Link, useLoaderData } from "@remix-run/react";

import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { prisma } from "~/database";

export const loader: LoaderFunction = async ({ request }) => {
  const tests = await prisma.test.findMany({
    include: {
      questions: {
        include: {
          answers: true,
        },
      },
    },
  });

  return json({
    tests,
  });
};

export default function All() {
  let { tests } = useLoaderData();

  console.log(useLoaderData());
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h2>All Tests</h2>
      <div>
        {tests.map((test) => {
          return (
            <div key={test.id}>
              <h3>{test.title}</h3>

              <ul>
                {test.questions.map((q) => (
                  <li>
                    {q.body}
                    <ul style={{ paddingLeft: 10 }}>
                      {q.answers.map((a) => (
                        <li key={a.id}>
                          {a.body} - {a.isCorrect ? "✓" : "𐄂"}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
