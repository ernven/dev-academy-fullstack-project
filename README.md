# Dev Academy Full-Stack Project

Project done as part of the application to Solita's Dev Academy.

## How To Set Up

### Setting up the backend

## How To Run

### Running the frontend app



## Project Structure & Technologies used

The structure of the project consists of a database for data storage, a backend server to handle requests and query the DB and a frontend web application for user interfacing.

In the following sub-sections I will go more into detail about the structure and the technologies used for it. The choice for these was done mostly based on what I am more experience and comfortable with -with slight exceptions- so as to not waste too much time going over the basics and could get straight to work.

### Backend

The backend runs on Node.JS using the express framework.

For database, I have chosen PostgreSQL and I have created an instace of it on Azure (thanks to student credits). The reason for this was that it would be much easier and faster to both set up and run than doing so locally (although with docker it's somewhat simplified, but there's still the extra load on the system).
I did not have much trouble with this, and I accessed the DB with [pgAdmin](https://www.pgadmin.org) to create tables and do maintenance.

### Frontend

The frontend web application was created with React. I have used some external libraries on parts of the application to speed up development (and have a -somewhat- pleasant looking UI). The design is basic, intended to show the features.

For the table component, I did at first my own implementation using react-table v7. I have used this library before and it's very good, but it really isn't suited to display large datasets (unless heavily modified, plus adding some external components). Since performance was unsatisfactory, I switched to [AG Grid](https://www.ag-grid.com).

Charts are done with the [Recharts](https://recharts.org/) library.

The UI is built using [Material-UI](https://mui.com).


## Closing remarks

This was quite a big project to do as a pre-assignment, but I am glad to have done it and I hope the results will be satisfactory. Not all features asked were implemented due to lack of time (I only started the project in the first week of January 2022, less than two weeks before the due date).

Many of the aspects of the implementation and features were based on assumptions, especially on the frontend app. In a real project, these questions would have been addressed in cooperation with both the team and the customer as they are mostly business-related. Some examples could be:
Should we display all the farms at once, or only one at a time? Basically, should the data from all farms be available to all users or should it be on a per user basis?
Is the table an important feature, listing large portions of the data, or is the software meant to be used as a dashboard, displaying mostly charts and important metrics?

And so on.

The backend is pretty good at handling different scenarios already, and more could be added on top without much hassle. If custom queries were to be crucial in the operation of the system, a GraphQL API could be a great addition, and it's not overly complicated to do. Again, this could be something discussed among the dev team.

Ultimately, I think the base is very good, and features could be added/taken easily as the development progresses.
