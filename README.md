# Property Pro Lite

[![Build Status](https://travis-ci.org/SamuelKoroh/PropertyProLite.svg?branch=develop)](https://travis-ci.org/SamuelKoroh/PropertyProLite)
&nbsp;&nbsp;[![Coverage Status](https://coveralls.io/repos/github/SamuelKoroh/PropertyProLite/badge.svg?branch=develop)](https://coveralls.io/github/SamuelKoroh/PropertyProLite?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/a34a257084f542b845e9/maintainability)](https://codeclimate.com/github/SamuelKoroh/PropertyProLite/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/a34a257084f542b845e9/test_coverage)](https://codeclimate.com/github/SamuelKoroh/PropertyProLite/test_coverage)<br/> Property Pro Lite is a platform where people can create and/or search properties for sale or rent.

# Technologies Used
<ul>
<li><a href='https://nodejs.org/en/' target='_blank' noreferral >Node</a> - Server Runtime Engine</li>
<li><a href='https://expressjs.com/' target='_blank' noreferral >Express</a> - MVC Framework</li>
<li><a href='https://www.postgresql.org/' target='_blank' noreferral >Postgres</a> - Database </li> 
<li><a href='https://cloudinary.com/' target='_blank' noreferral >Cloudinary</a> - Image Server </li> 
<li><a href='https://nodemailer.com/' target='_blank' noreferral >Nodemailer</a> - Sending Mail </li> 
</ul>

# Features
<ul>
<li>User can signup as regular or agent</li>
<li>User can sign in</li>
<li>Users can update their profile</li>
<li>Admin can make or remove other users from admin role</li>
<li>Admin can activate or deactivate user profile</li>
<li>Admin can remove fraudulent users account </li>
<li>User can reset his/her password </li>
<li>User(agent) can post property advert with multiple images</li>
<li>User(agent) can mark advert as sold</li>
<li>User(agent) can update advert</li>
<li>user(admin) can activate or deactivate advert</li>
<li>Users can report suspicious advert</li>
<li>Admin can view and remove reports made by users </li>
<li>Users can add advert of interest to their favourites list</li>
<li>Users can view and remove advert from their favourites list </li>
</ul>

# API Endpoints

| Method  | endpoint                          | description                             |
| ------- | --------------------------------- | --------------------------------------- |
| POST    | /auth​/signup                     | Register user                           |
| POST    | /auth​/signin                     | User login                              |
| POST    | /auth​/{email}​/reset-password    | Request password reset                  |
| GET     | /auth​/{token}​/reset-password    | Validate user token                     |
| PATCH   | /auth​/{token}​/reset-password    | Update profile password                 |
| POST    | /property                         | Creating new property                   |
| GET     | /property                         | Get all property adverts                |
| GET ​   | /property​/{propertyId}           | Get a specific property advert.         |
| PATCH   | ​/property​/{propertyId}          | Update property                         |
| PATCH   | /property​/{propertyId}​/sold     | Mark a property as sold                 |
| PATCH   | /property​/{propertyId}​/activate | Activate or                             | Deactivate suspicious advert |
| DELETE  | /property​/{propertyId}           | Remove a specific property advert.      |
| GET     | ​/users                           | Get all site users                      |
| PATCH   | ​/users                           | Update user profile                     |
| GET     | ​/users​/me                       | User profile                            |
| GET     | ​/users​/{userId}                 | View user profile and adverts           |
| PATCH   | ​/users​/{userId}​/activate       | Activate user profile                   |
| PATCH   | ​/users​/{userId}​/set-admin      | Set user as admin                       |
| DELETE  | /users​/{userId}                  | Delete user profile                     |
| POST    | /flag                             | Flag property advert                    |
| GET ​   | /flag                             | Get all flagged property                |
| GET ​   | /flag​/{flagId}                   | Get flaged property                     |
| DELETE  | /flag​/{flagId}                   | Delete flaged property                  |
| GET     | /favourites                       | Get user favourite property             |
| POST    | ​/favourites​/{propertyId}        | Add property to favourites              |
| DELETE  | /favourites​/{favouriteId}        | Remove property from favourite list     |
| POST    | /deals-types​/deals               | Add new deal                            |
| GET     | /deals-types​/deals               | Retrieve all deals                      |
| GET     | /deals-types​/deals​/{id}         | Retrieve single deal by its ID          |
| PATCH ​ | /deals-types​/deals​/{id}         | Update deal details                     |
| DELETE  | /deals-types​/deals​/{id}         | Remove a deal                           |
| POST ​  | /deals-types​/types               | Add new property types                  |
| GET     | /deals-types​/types               | Retrieve all property types             |
| GET     | /deals-types​/types​/{id}         | Retrieve single property type by its ID |
| PATCH   | /deals-types​/types​/{id}         | Update property type details            |
| DELETE  | /deals-types​/types​/{id}         | Remove property type                    |


# System Testing 
<ul>
<li>Create a folder on your drive</li>
<li>Clone https://github.com/SamuelKoroh/PropertyProLite.git from your terminal</li>
<li>Still from the terminal cd into root directory i.e propertyprolite </li>
<li>Run npm install from your to download all the required dependencies</li>
<li>Create a .env file on the root directorty</li>
<li>Setup the following environmental variables inside .env file 
<pre><code>CLOUDINARY_CLOUD_NAME=cloud_name
CLOUDINARY_API_KEY=pi_key
CLOUDINARY_API_SECRET=api_secret
JWT_SECRET=jsonwebtokensecret
MAIL_USER=email_address
MAIL_PASS=email_address
TEST_DB=test_database_url
DATABASE_URL=prod_database_url</code></pre>
</li>
<li>Create a database with the following tables inside of models/travis.sql script file</li>
<li>Run npm run build to build the project for Production</li>
<li>Run npm start to start the server in Production  </li>
<li>Run npm dev to start the server in Development  </li>
<li>Using postman navigate to localhost:3500/api/v1/{endpoint} to test various endpoint</li>
</ul>

## Note
The endpoints below reuires you to send data to server with Form-Data <br/>

Set file as the name for the file upload control for these edpoint to upload profile image

POST    / localhost:3500/api/v1/auth​/signup  
PATCH / localhost:3500/api/v1/​users <br/>

Set files as the name for the file upload control for these edpoint to upload advert images

POST / localhost:3500/api/v1/property​ <br/>
PATCH / localhost:3500/api/v1/property​/{propertyId}  <br/>

User x-auth-token for sending valid token to protected endpoints

# Default Admin User

Email: admin@gmail.com

Password: admin

# Online Resources

Online API Documentation - https://sam-propertyproplite.herokuapp.com/api-docs/ 

Frontend - https://samuelkoroh.github.io/PropertyProLite/ui/index.html

Pivot Tracker - https://www.pivotaltracker.com/n/projects/2363942