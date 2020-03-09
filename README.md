# Developer Profile Generator

This is a command-line application that dynamically generates a PDF profile from a GitHub username. The application will be invoked with the following command:

```sh
node index.js
```

The user will be prompted for a color, which will be used as the background color for cards. The PDF will be populated with the following:

- Profile image
- User name
- Links to the following:
  - User location via Google Maps
  - User GitHub profile
  - User Portfolio
- User bio
- Number of public repositories
- Number of followers
- Number of GitHub stars
- Number of users following

### Tools and concepts:
* axios to make an api call to github
* html-pdf to convert html file to pdf
* inquirer to prompt for github username
* cloudinary to host an image
* html injection
* string literal

![Profile Screenshot](Screenshot.PNG)
