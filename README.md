# TwitterClone

## Table of Contents  
[Introduction](#introduction)  
[Stack](#stack)    
[Setup](#setup)  
[Demo](#demo) 

<a name="introduction"/>
<a name="stack"/>
<a name="setup"/>
<a name="screenshots"/>
<a name="demo"/>

## Introduction

Simple stripped down version of twitter app created with Nodejs, graphql, mongodb, and React. 

## Stack: 
  - Typescript 🔠
  - Server
    - mongodb **v4.2.7** 📅
    - nodejs **v12.21.0** 🟩
    - apollo-server-express **^2.23.0** 🚧
  - Client 
    - react **^16.10.1** ⚛️
    - graphql **^15.5.0** 🍀
    - @apollo/client **^3.3.9** 🚀
    - styled-components **^5.1.0** 💅🏿
    
## Setup: 
  - Install mongodb
    - https://docs.mongodb.com/manual/installation/ how to create mongodb user -  (https://www.guru99.com/mongodb-create-user.html)
  - Install redis
    - https://redis.io/topics/quickstart
  - Create and configure Cloudinary account
    - https://cloudinary.com/users/login
  
   - Create .env file in the root of the project with following keys.  
   
    DB_LOCAL_USERNAME  
    DB_LOCAL_PASSWORD  
    DB_LOCAL_NAME  
    REFRESH_TOKEN_SECRET
    ACCESS_TOKEN_SECRET
    CLOUDINARY_NAME
    CLOUDINARY_KEY
    CLOUDINARY_SECRET

   - If you plan to deploy you'll need redis database - https://app.redislabs.com/#/login, this step is not necessary for local installation.  
   
    REDIS_HOST  
    REDIS_USERNAME  
    REDIS_PASSWORD  
    
   - run ```npm install``` 
   - to start development server  u can run ```npm start```
   - for the client side ```cd client && npm start```
   - If u have ```concurrently``` installed on your machine u can run ```npm run dev```, which starts ur server, client, mongodb process and a redis-server
  
  ```yaml
  "scripts": {
     "dev": "concurrently \"ts-node-dev --respawn --transpile-only index.ts\" \"cd client && npm start\" \"mongod --auth\" \"redis-server\""
    }
  ```
  
 ## Demo:
 
  - If You wish to see how the app looks without installing anything feel free to visit:
  https://frozen-ridge-40926.herokuapp.com/home and create an account.
  
  ![vino map gif](https://github.com/chimson/TwitterClone/blob/master/client/github_markdown_screens/oBNE3rjQ7O.gif)
