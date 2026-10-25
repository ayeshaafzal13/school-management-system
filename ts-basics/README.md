# ts-basics

A small Express + TypeScript API that shows typed routes and generics.

- Typed Express routes: `src/server.ts` (`Request<Params, ResBody, ReqBody>` and `Response<ApiResponse<...>>`)
- Generic types: `src/types.ts` (`ApiResponse<T>` and `Repository<T extends HasId>`)
- Strict mode and `noImplicitAny` are on.

Run it:

    cd ts-basics
    npm install
    npm run dev

Try it:

    GET    http://localhost:4000/students
    GET    http://localhost:4000/students/1
    POST   http://localhost:4000/students   {"name":"Sara","surname":"Ali","className":"3A"}
    DELETE http://localhost:4000/students/1