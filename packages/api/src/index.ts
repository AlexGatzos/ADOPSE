// localhost:3000/user/123/questions -> fetch('localhost:3000/user/123', { method: "GET" }) -> server -> path "/user/:asdfasdf" -> function(request: params.asdfasdf = 123)
import { Prisma, PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { request } from "http";
import formbody from 'fastify-formbody';



// HTTP Status Codes
// 2XX OK
// 3XX Redirect
// 4XX Not found
// 5XX Error

// HTTP Methods
// [GET]
// fere user me id=1
// Query Params meta to ?
// h sto path

// [POST]
// ston user me id=1 bale body { name="alex" }

//

let prisma = new PrismaClient();

// Server
let server = fastify();

server.register(formbody);

server.get("/", async (req, res) => {
  let users = await prisma.user.findMany({
    where: {
      role: {
        name: "admin",
      },
    },
  });

  res.status(200).type("text/html").send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      ${users
        .map((user) => {
          return user.name;
        })
        .join()}
    </body>
    </html>
  `);
});

server.get('/signup', async (req,response) => {
  response.status(200).type("text/html").send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      <h1>Δημιουργία λογαριασμού</h1>
      <form method="post">
        <label>
          Email:
          <input name="email" />
        </label>
        <label>
          Password:
          <input name="password" type="password" />
        </label>
        <button type="submit">
          Δημιουργία λογαριασμού
        </button>
      </form>
    </body>
    </html>
  `);
})

server.post('/signup', async (req, res) => {
  let userRole = await prisma.userRole.findFirst({
    where:{
      name:'student'
    }
  })
  await prisma.user.create({
    data: {
      role:{
        connect:{
          id:userRole.id
        }
      },
      email: req.body.email,
      password: req.body.password
    }
  })

  res.redirect(303, '/login')
})

server.get('/login', async (req,response) => {
  response.status(200).type("text/html").send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      <h1>Eisodos</h1>
      <form method="post">
        <label>
          Email:
          <input name="email" />
        </label>
        <label>
          Password:
          <input name="password" type="password" />
        </label>
        <button type="submit">
          Eisodos
        </button>
      </form>
    </body>
    </html>
  `);
})

server.post('/login', async (req, res) => {
  let user = await prisma.user.findUnique({
    where: {
      email: req.body.email
    }
  })

  if (user.password === req.body.password) {
    // Login
    console.log('Swsto')
  } else {
    // Lathos kwdikos
    console.log('Lathos')
  }
})

server.get("/user/:id", async (request, response) => {
  let id = request.params.id;
  let user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  response.status(200).type("application/json").send(user);
});


server.get("/teachers", async (request, response) => {
  let users = await prisma.user.findMany({
    where: {
      role: {
        name: "teacher",
      },
    },
    include: {
      role: true
    }
  });

  // prisma.user.findUnique({
  //   where: {
  //     id: "123",
  //   },
  //   include: {
  //     role: true
  //   }
  // })

  response.status(200).type("text/html").send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      <h1>Καθηγητές</h1>
      <ul>
      ${users
        .map((user) => {
          return `
          <li>
            <div>
              ${user.name}
            </div>
            <div>
              ${user.role.name}
            </div>
          </li>
        `;
        })
        .join()}
      </ul>
    </body>
    </html>
  `);

  // response.status(200).type("application/json").send(users)
});

server.get(
  "/user/:userId/questions/:questionsid",
  async (request, response) => {
    let id = request.params.questionsid;
    let question = await prisma.question.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    response.status(200).type("application/json").send(question);
  }
);

server.delete(
  "/user/:userId/questions/:questionsid",
  async (request, response) => {
    let id = request.params.questionsid;
    let question = await prisma.question.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    response.status(200).type("application/json").send(question);
  }
);

server.get("/user/:userid/course/:courseid", async (request, response) => {
  let id = request.params.courseid;
  let course = await prisma.cource.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  response.status(200).type("application/json").send(course);
});

server.get("/user/:userid/exam/:examid", async (request, response) => {
  let id = request.params.examid;
  let exam = await prisma.exam.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  response.status(200).type("application/json").send(exam);
});

server.listen(3000, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server ready at: http://localhost:3000`);
});
