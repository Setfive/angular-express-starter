# Angular and Express starter project

This is an [Angular](https://angular.io/) (14) and [Express](https://expressjs.com/) (4.18) starter project. 

It includes several libraries to kickstart your project:
* [Bootstrap](https://getbootstrap.com/)
* [Passport.js](https://www.passportjs.org/)
* [TypeORM](https://typeorm.io/)
* [class-validator](https://github.com/typestack/class-validator)
* [class-transformer](https://github.com/typestack/class-transformer)
* [eslint](https://eslint.org/)
* [bcrypt](https://www.npmjs.com/package/bcrypt)
* [prettier](https://prettier.io/)

## Get started

Install the dependencies with ```npm install```, then you'll need to start the 
Express server by running ```npm run start-server``` and start the Angular dev server with ```npm start```

The Angular app will come up at http://localhost:4200 and the Express API will be available at http://localhost:8080

Click the "Register" button to register a user. After you register you'll be automatically logged in and see your profile on the Dashboard.

Now, you can refresh the page and login with the user you just created.

## Next steps

The first thing you may want to do is replace Sqlite with a fully featured database like Postgres.
To do that, install [pg](https://www.npmjs.com/package/pg) and then change the connection details in server/src/database.ts

After that, you can add new Angular components and Express routes to build out your application.