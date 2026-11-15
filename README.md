# Placemark App

## Project Description
This project is a web app and REST API of places of interest to visit in  County Kilkenny, Ireland. Registered users can create places including uploading photos, update those places, delete their own places, and also read the places other users have uploaded. 

- The github repository for this project is [here](https://github.com/AdamMcCarthyCS/placemark).

- The labwork for the course which resulted in this project is [here](https://github.com/AdamMcCarthyCS/Web-App-Development-Y2).

## Installation Instructions
1.  Install `Node.js` 20-23 and `npm`
2.  Clone the git respository `git clone {repo-url}`
3.  Navigate to placemark folder `cd placemark`
4.  Install dependencies `npm install`
5.  Install a MongoDB Server from [here](https://www.mongodb.com/try/download/community-kubernetes-operator)
6.  If .env file is provided copy it into `placemark` folder. Otherwise, create a `.env` file in the project root witih the following:
```bash
# .env file
port=3000
name=placemark
cookie_password=some-long-random-secret-at-least-32-characters
# link to a MongoDB database you can access
db=MongoDB-connection-string

# to enable cloudinary image uploads you also need
cloudinary_name=your-cloudinary-name
cloudinary_key=your-cloudinary-key
cloudinary-secret=your-cloudinary-secret 
```
7. Start the app with `npm start` or for development with restarts use `npm run dev`
8. Open `http://localhost:3000` in your browser.  
## Usage
#### Web App

##### User Account
1)  Create a user on the `Sign Up` page. Info entered here is validated and errors provided to assist in signup process
2)  Log in using the users email and password on the `Log In` page
3)  You will be redirected to the `My Places` page. Here you can
    -   Add places using the form fields
    -   View/edit your place details using the information button
    -   Delete places using the trash can icon
4)  On the place details page you can
    -   Edit place details using the edit button
    -   Upload an image for a place from your computer
5)  On the `Public Places` page you can view the details of other users places including their images 
6)  On both `My Places` and `Public Places` pages you can filter the places displayed into the categories `All`, `Social`, `Food and Dining`, `Shopping`, and `Landmark`

##### Admin Account
1) Sign with admin email and password
2) You will be redirected to the `Places` page. Here you can delete places of any user or view their details
3) In a places details page you can edit the place details but not the photo. In order to remove the photo you must delete the place.
4) In the `Site Info` page you can view each user of the site along with their added places. There is also a count of the total number of users and places on the site as a whole.

#### API

1)  Authenticate a user using the /api/users/authenticate route. If successful you will recieve a token which is valid for one hour.
2)  Add this token to the header of any GET, POST, or DELETE request along with the 'accept: application/json' and 'Content-Type: application/json' arguments
3)  You will then be able to access all the api routes available. They are the following:
```
GET     /api/users                      (get all users)
POST    /api/users                      (add a user)
DELETE  /api/users                      (delete all users)
DELETE  /api/users/{id}                 (delete a user by id) 
GET     /api/users/{id}                 (get a user by id)
POST    /api/users/Authenticate         (authenticate a user - token not required)

GET     /api/places                     (get all places)
POST    /api/places                     (add a place)
GET     /api/places/{id}                (get a place by id)
DELETE  /api/places                     (delete all places)
DELETE  /api/places/{id}                (delete a place by id)
GET     /api/places/user/               (get all places of logged in User)
GET     /api/places/category/{category} (get all places by category)
```

## Configuration
The database can be seeded for demonstration purposes by uncommenting `line 33` in `src/models/mongo/connect.js`. This populates some users and places so the apps functionalities can be demonstrated.

For regular use the admin is automatically seeded. 

Note: If seeding takes place the ***collections already in place are dropped***. It is recommeneded to set up a separate database connection to populate seed data in order to not lose accumulated data.

## Limitations/Future Directions
#### Passwords
###### Limitation
- Currently passwords are stored in the database as text
- There is no support for resetting passwords
###### Future directions
- Hash passwords so they are not readable in the database
- Add password reset support

#### API Route Authorization
###### Limitation
- Currently any user can perform API operations that affect other users and their places
###### Future directions
- Restrict delete all users and places to administrators only
- Restrict delete places to their owners and admins
- Restrict delete users to administrator only
- Restrict get a user by id to administrator only

Note: This was attempted but because it requried major refactoring of the test suite it was postponed to V2.

#### Testing
###### Limitations
- Following on from the API Route Authorization limitations outlined above the test suite is currently not sufficient to cover role based API operations
###### Future directions
- Refactor test suite to handle role based API operations


#### Seed Data
###### Limitation
- Data seeding relies on uncommenting lines of code
###### Future directions
- Allow programatic seeding of the database as a package.json script command

## AI Usage
- I asked ChatGPT for help 
    - to Understanding how to navigate back and forth as an admin/user using query parameters 
    - Identifying why fixture duplication was happening in my test fixture data
    - Generating a starting template for seed data which i expanded
    - How to structure a cloudinary transformation url (but ended up not using)
    - I asked for help debugging my details and admin controllers when they didnt work as i expected and I had tried several fixes 

- ChatGPT did not write any code in this project. I asked for suggestions, verified information given in the associated documentation and coded my solutions myself.

## Licence
This project is licenced GNU GPLv3 (Copyleft). It is not intended to become proprietary software and SHALL reamin open source. (where "SHALL" here is intented in the sense of [RFC 8174](https://www.rfc-editor.org/info/rfc8174/) and its predecessor [RFC 2119](https://www.rfc-editor.org/info/rfc2119/))


Anyone who modifies or distributes this code must also release their source code under the GPLv3.

## Contact Information
***Github:*** [https://github.com/AdamMcCarthyCS](https://github.com/AdamMcCarthyCS)
***Email***: adammccarthycs@gmail.com

## Acknowlegements
Thanks to [Rosanne](https://www.setu.ie/staff/rosanne-birney) and [Eamonn](https://www.setu.ie/staff/eamonn-deleastar) at [SETU](https://www.setu.ie/courses/higher-diploma-in-computer-science-2-years-online) for their video lectures and content where I learned how to build this application.
