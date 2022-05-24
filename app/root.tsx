import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { json } from "@remix-run/node";
import { useOptionalUser } from "./useUser";
import { getUser } from "./session";

import defaultStyles from "./styles/defaults.css";
import styles from "./styles/main.css";

export function links() {
  return [
    { rel: "stylesheet", href: defaultStyles },
    { rel: "stylesheet", href: styles },
  ];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
  });
};

export default function App() {
  let user = useOptionalUser();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <main className="page">
          <nav className="header">
            <h1>
              <Link to="/">adopse</Link>
            </h1>
            {user ? (
              <div>
                <Link to="logout">Sign Out</Link>
              </div>
            ) : (
              <div>
                <Link className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400" to="login">Sign In</Link>
                <Link className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400" to="signup">Sign Up</Link>
              </div>
            )}
          </nav>

          <nav className="sidebar">
            <ul>
              <li>
                <strong>Questions</strong>
                <ul>
                  <li>
                    <Link to="/questions/all">All questions</Link>
                  </li>
                  <li>
                    <Link to="/questions/user">My questions</Link>
                  </li>
                  <li>
                    <Link to="/questions/new">New Question</Link>
                  </li>
                </ul>
              </li>
              <li>
                <strong>Test</strong>
                <ul>
                  <li>
                    <Link to="/test/all">All tests</Link>
                  </li>
                  <li>
                    <Link to="test/user">My tests</Link>
                  </li>
                  <li>
                    <Link to="/test/new">New Test</Link>
                  </li>
                </ul>
              </li>
              <li>
                <strong>Exam</strong>
                <ul>
                  <li>
                    <Link to="exam/user">My exams</Link>
                  </li>
                  <li>
                    <Link to="/exam/new">New exam</Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link to="/courses/new">Courses</Link>
              </li>
            </ul>
          </nav>
          <div className="content">
            <Outlet />
          </div>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </main>
      </body>
    </html>
  );
}
