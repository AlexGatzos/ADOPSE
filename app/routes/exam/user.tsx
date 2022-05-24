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
  const exams = await prisma.exam.findMany({
    where: {
      userid: userId
    },
    include: {
      test: true
    }
  });

  return json({
    exams,
  });
};

export default function All() {
  let { exams } = useLoaderData();

  console.log(useLoaderData());
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h2 className="marginmiddle">My exams</h2>
      <div className="marginmiddlebold">
        {exams.map((exam) => {
          return (
            <div key={exam.id}>
              <h3 className="course">{exam.test.title}</h3>

              {exam.score}
            </div>
          );
        })}
      </div>
    </div>
  );
}
