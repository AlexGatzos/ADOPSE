import { Form, Link, useLoaderData } from "@remix-run/react";

import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { prisma } from "~/database";
import { requireUserId } from "~/session";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const cources = await prisma.cource.findMany({
    include: {
      questions: {
        where: {
          userId
        },
        include: {
          answers: true,
        },
      },
    },
  });

  return json({
    cources,
  });
};

export default function All() {
  let { cources } = useLoaderData();

  console.log(useLoaderData());
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h2 className="marginmiddle">My Questions</h2>
      <div className="marginmiddlebold">
        {cources.map((cource) => {
          return (
            <div key={cource.id}>
              <h3 className="course">{cource.name}</h3>

              <ul>
                {cource.questions.map((q) => (
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
