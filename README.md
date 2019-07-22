# Meetapp

 Project developed in Rocketseat :rocket: GoStack Bootcamp. The application developed is an application event aggregator for developers called Meetapp.
 
 ## About Meetapp
 
 Meetup is an application that aims to be able to create events, meetings and meetings between developers. For the development of the app were used technologies like PostgreSQL as relational database, Redis, Bee-queue and nodemailer for control of sending of emails, JWT authentication besides many functionalities, such as:

- registration and updating of user data;
- registration of meetings;
- registration at meetings;
- sending e-mails to the organizer of the event if someone signs up;
- the organizer can change the event data or cancel it if it has not already happened;
- list meetings;
- The organizer has a list of encounters he has created.

## Pre-Install

 Before you use this application, you need to install a postgreSQL database and Redis database. I strongly recommend you use docker.

## Installation

- Clone this with git clone https://github.com/DavidStinghen/Meetapp.git;
- Run yarn to install node dependencies;
- Configure .env file like .env.example, using your own credentials;
- Run yarn sequelize db:migrate;
- Launch yarn dev to run API;
- Launch yarn queue, to run Bee-Queue.

## Examples of what Meetapp can do

### Create a new user

You can create a new user by adding name, e-mail, and password.

POST route:

`http://localhost:3333/users`

JSON body:

```
{
	"name": "Test User",
	"email": "testuser@mailtest.com.br",
	"password": "12345678"
}
```

Return:

```
{
  "id": 1,
  "name": "Test User",
  "email": "testuser@mailtest.com.br",
  "provider": false
}
``` 

### Create a session

you can start a session using the email and password used in the registration, the session will generate a token for the authorizations required to use the application.

POST route:

`http://localhost:3333/session`

JSON body:

```
{
  "email": "testuser@mailtest.com.br",
  "password": "12345678"
}
```

Return:

```
{
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "testuser@mailtest.com.br"
  },
   "token":   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNTYzMDM1ODIxLCJleHAiOjE1NjM2NDA2MjF9.lInf1Rw68CKgFhNRCt7FduULdsTTkb8JmPsm_iEfG_8"
}
```

### Create a meetup

For the user to create a new meetup the same must be logged as also to choose the title, description, location, date/time of the meetup.

POST route:

`http://localhost:3333/meetups`

JSON body:

```
{
  "title": "Rocketseat Bootcamp",
  "description": "class to use OmniStack,
  "location": "Rio do sul",
	"date": "2019-07-23T13:00:00-03:00"
}
```

Return:

```
{
  "id": 1,
  "user_id": 1,
  "title": "Rocketseat Bootcamp",
  "description": "class to use OmniStack,
  "location": "Rio do sul",
	"date": "2019-07-23T13:00:00-03:00"
  "updatedAt": "2019-07-13T23:09:22.604Z",
  "createdAt": "2019-07-13T23:09:22.604Z",
}
```

***You can see more exemples of usage inporting  [insomnia.json](https://raw.githubusercontent.com/DavidStinghen/Meetapp/master/insomniaTestExamples.json 'Insomnia config') to your Insomnia workspace***

### Thanks to

[Rocketseat](https://rocketseat.com.br 'Rocketseat')
