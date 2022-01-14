# Dev Academy Full-Stack Project

Project done as part of the application to Solita's Dev Academy. Original assignment page is [here](https://github.com/solita/dev-academy-2022-exercise).

I have worked on this a little over one week, since I have only found out about the assignment recently. It would have been good to have more time, but I wanted to give it a try anyway.

# Table Of Contents

Index here

## First Steps

### How To Set Up

The easiest way to get set up is cloning this repository and with [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). All required dependencies can be installed with the following command:

    npm install

This needs to be executed inside **both** backend and frontend directories.

#### About the Database

The project was developed using a PostgreSQL (v11) database running on Azure. More info under [Project Structure]. The address to the DB will be sent along with the application to Solita for testing.

When running the project on your own system, one can set up their own DB server, if that is preferred. In order to create the right data structures for the project to work with, I have included my table creation scripts under the `utils` folder on the root.

Remember to update the connection details on `backend/config/config.js`. The app should work fine with PostgreSQL without any further changes.

For other SQL dialects, the required driver used by the backend must be installed; more information [here](https://knexjs.org/#Installation). The SQL statements might also needs small changes for another server/dialect, careful with that!

### How To Run

Once the dependencies are installed for each part of the project and the environment variables have been set up (as well as having a database to work with), we can run the software.
Both the backend server and frontend web app can be run in development mode by going to each respective folder and running the command:

    npm start
    
With default settings and the environment variables properly set, each should have their own port and the frontend will proxy to the backend, thus avoiding CORS errors when sending requests.

The backend can be tested by running queries any of the endpoints (more info about these in the next section). The frontend can be tested by going to localhost:3000 (by default) on your browser.

## Using the system

#### API Reference

Since the project guidelines are quite open, the data is served from the backend in many different ways. Not all are used by the frontend application at the moment, but they could be useful for future features.

The following endpoints are implemented:

##### Querying Data From The DB

`GET /farms` - Returns all farm names and ids.

`GET /data` - Returns all the farms's data from the database. With the sample data, this can be very large!

`GET /data/filter` - Enables filtering of the whole dataset based on the query parameters of the request. The data can be filtered by **_name_, _type_, _startDate_** and/or **_endDate_**. For example: /data/filter?name=This Farm&type=temperature

`GET /data/by-period/:year/:month?` - This allows to perform a query specifying the year or year-month period to which we query by, using path parameters. Used as, for example: /data/by-period/2020/11 will return entries from November 2020. Month is optional.

##### Getting calculated data

`GET /data/averages` - This will return the average values for each farm and sensor type.

`GET /data/extremes` - This will return the maximum and minimum values for each farm and sensor type.

`GET /data/chart-format` - This will return data best suited to be formatted to use with recharts. It should be queried for a spefic type and returns only date, farm_name and read_value.
Different charts might have different data needs, however, for example if one wanted to show min, max values, the previous would be more useful.

##### Inserting Data Into The DB

`POST /farms` - Used for adding new farms to the database.

`POST /data` - Used for adding new data entries to the database (either in JSON form or from a csv file, such as the ones provided in the assignment).

### Using the frontend app

The app contains a few different basic views designed to show what potential features could be like.

First link on the navigation drawer is to the **Admin dasboard**. This could be behind some authentication (I had thought of implementing this, but ultimately ran out of time). Here, the user can add new farms and upload csv files to add farms data directly from the UI. The app should give feedback whether the operation was successful or not.

Then we have the **Table View**, which displays all the data available. It supports filtering and sorting for the columns.

There is also a **Chart View** where the user can see an example graph. This chart shows the average daily values for the year 2020 for all farms, and the sensor type can be chosen to display different readings. The year or timeframe could be easily made customizable for even more flexibility (data is large, though, so careful with loading too much at once).

Lastly, we have a **Dashboard** where one can see a basic overview of the readings for each farm, consisting of minimum, maximum and average values for each sensor type. Again, the information shown here could be changed.

## Project Structure & Technologies used

The structure of the project consists of a database for data storage, a backend server to handle requests and query the DB and a frontend web application for user interfacing.

The main (root) folder contains the backend, the frontend and an utils folder, the latter which contains the database/table creation scripts and some sample data to perform tests with.

In the following sub-sections I will go more into detail about the structure and the technologies used for it. The choice for these was done mostly based on what I am more experience and comfortable with -with slight exceptions- so as to not waste too much time going over the basics and could get straight to work.

### Backend

For database, I have chosen PostgreSQL and I have created an instace of it on Azure (thanks to student credits). The reason for this was that it would be much easier and faster to both set up and run than doing so locally (although with docker it's somewhat simplified, but there's still the extra load on the system).
I did not have much trouble with this, and I accessed the DB with [pgAdmin](https://www.pgadmin.org) to create tables and do maintenance.

#### Database Structure

The database contains two tables.

`farms`

| Column         | Definition                                                                                                                  |
|----------------|-----------------------------------------------------------------------------------------------------------------------------|
| id             | Type UUID, NOT NULL, auto generated. Primary Key.                                                                           |
| farm_name      | Type VARCHAR(50), NOT NULL.                                                                                                 |

`entries`

| Column         | Definition                                                                                                                  |
|----------------|-----------------------------------------------------------------------------------------------------------------------------|
| entry_id       | Type bigint, NOT NULL, auto generated. Primary Key.                                                                         |
| farm_id        | Type UUID, NOT NULL. Foreign Key, referencing farms.id.                                                                     |
| date           | Type TIMESTAMP, NOT NULL.                                                                                                   |
| entry_type     | Type VARCHAR(11), NOT NULL. Must be either 'pH', 'rainFall' or 'temperature'.                                               |
| read_value     | Type NUMERIC(5,2), NOT NULL. Must be between -50.00 and 500.00, per project guidelines.                                     |

### Backend

The backend runs on Node.JS using the express framework.

The folder structure is as follows (skipping mandatory node files and folders):

backend<br/>
&emsp;&emsp;    |- config       &emsp;&emsp;&ensp;        Contains configuration files.<br/> 
&emsp;&emsp;    |- controllers  &ensp;                    Contains the different controllers, making up the bridge layer between the routes and the infra (db).<br/> 
&emsp;&emsp;    |- routes       &emsp;&emsp;&ensp;        Contains the different routes used by express.<br/> 
&emsp;&emsp;    |- utils        &emsp;&emsp;&emsp;&ensp;  Contains various utilities such as middlewares and the validation module.<br/> 
&emsp;&emsp;    |- index.js     &emsp;&ensp;&ensp;        Entry point for the backend server.<br/> 

### Frontend

The frontend web application was created with React. I have used some external libraries on parts of the application to speed up development (and have a -somewhat- pleasant looking UI). The design is basic, intended to show the features.

The folder structure is (skipped small element-components):

frontend<br/>
&emsp;                |- src<br/>
&emsp;&emsp;          |- components<br/>
&emsp;&emsp;&emsp;    |- AdminPage<br/>
&emsp;&emsp;&emsp;    |- Dashboard<br/>
&emsp;&emsp;&emsp;    |- DataGrid<br/>
&emsp;&emsp;&emsp;    |- DataTable_unused<br/>
&emsp;&emsp;&emsp;    |- Graph<br/>
&emsp;&emsp;&emsp;    |- HeaderDrawer<br/>
&emsp;&emsp;          |- utils<br/>
&emsp;&emsp;          |- App.css<br/> 
&emsp;&emsp;          |- App.js<br/>

For the table component, I did at first my own implementation using react-table v7. I have used this library before and it's very good, but it really isn't suited to display large datasets (unless heavily modified, plus adding some external components). Since performance was unsatisfactory, I switched to [AG Grid](https://www.ag-grid.com). (Note: the old table components are still in an "unused" folder under `src` as they might be useful in the future)

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
