# Placemark App

## Project Description
This project is a web app and REST API of places of interest to visit. Registered users can create places including uploading photos, update those places, delete their own places, and also read the places other users have uploaded.

- The github repository for this project is [here](https://github.com/AdamMcCarthyCS/placemark).

- The labwork for the course which resulted in this project is [here](https://github.com/AdamMcCarthyCS/Web-App-Development-Y2).

## Installation Instructions
1.  Install `Node.js` 20-23 and `npm`
2.  Clone the git respository `git clone {repo-url}`
3.  Navigate to placemark folder `cd placemark`
4.  Install dependencies `npm install`
5.  Install a MongoDB Server from [here](https://www.mongodb.com/try/download/community-kubernetes-operator)
6.  Create a `.env` file in the project root witih the following:
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
- Web app
- Link to api docs

## Configuration
- seeding

## Future Directions/Limitations
- Admin/Owner only delete places, list all user places
- Admin only delete user

## Reflections
- Good ideas/bad ideas

## AI Usage
- State no code written by AI and any info checked against documentation
- State areas asked AI for suggestions on how to proceed

## Licence
This project is licenced GNU GPLv3 (Copyleft). It is not intended to become proprietary software and shall reamin open source.

Anyone who modifies or distributes this code must also release their source code under the GPLv3.

## Contact Information
***Github:*** [https://github.com/AdamMcCarthyCS](https://github.com/AdamMcCarthyCS)
***Email***: adammccarthycs@gmail.com
## Acknowlegements/References

