# Notes App

## Description

- ### the objective of this project it's Application similar to notion with an idea to help peoples to remember something, express theyselves,or make your own Routine

## Use Cases.

- ### with notes App you can create your personal account and customize it as you prefer, futhermore you can make cards pick Colors for them and customize titles and descriptions,Update cards and More !!

## Project Stack

1. Node
2. Typescript
3. Express
4. Jest
5. Docker
6. Github Actions
7. MongoDB
8. React
9. Axios

## Documentation Back End

### Postman:

[Link Postman Documentation ](https://documenter.getpostman.com/view/29716630/2sAXqv6MKz)

### Enviorement Variables

- DB_NAME=Your DB_NAME
- DB_USERNAME=Your DB_USERNAME
- CONNECTION_URL_LOCAL=Your URL_LOCAL
- PORT_APP=Your PORT_APP
- PRIVATE_KEY_JWT=Your PRIVATE_KEY_JWT

### EndPoints

- http:localhost:{PORT_APP}/welcome
- http:localhost:{PORT_APP}/register
- http:localhost:{PORT_APP}/login
- http:localhost:{PORT_APP}/user
- http:localhost:{PORT_APP}/post/{id}
- http:localhost:{PORT_APP}/post?page=1
- http:localhost:{PORT_APP}/post/title?title=Title

### Installation

#### Prerequisites

1. you must have a machine with network
2. Install Git:
   [Link Download Git](https://daringfireball.net/projects/markdown/)
3. Install Node with NPM:
   [Link Download Node](https://nodejs.org/pt)
4. Install Docker and Docker compose:
   [Link Download Docker](https://www.docker.com/)

#### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/JoseLucasdevv/notes_app
   ```
2. Enter the notes_app folder, and then go into the back-end folder.:

   ```bash
   cd notes_app
   cd back-end
   ```

3. Install dependencies project with npm:

   ```bash
   npm install
   ```

4. now you must create your .env File and set your enviroment variables.
   ```bash
   touch .env
   ```
5. now you can get up your container using Docker
   ```bash
   sudo docker compose up
   ```
6. after those steps you can access localhost on your machine localhost:{PORT_APP}/welcome and localhost:8081

## Frontend Notes App

### Features

#### Main Features

1. **User Registration**

- Users can register by providing their name, email, and password.
- The password must be confirmed during registration.

2. **User Login**

- Users can log in by providing their email and password.
- After logging in, an authentication token is stored in the cookies.

3. **Notes Management**

- **Creating Notes**
  - Users can create new notes by providing a title, description, and color.
- **Editing Notes**
  - Users can edit existing notes.
- **Viewing Notes**
  - Users can view details of a specific note.
- **Deleting Notes**
  - Users can delete existing notes.

#### Additional Features

- **Profile Modal**
  - Users can update profile information.
- **Pagination**
  - Notes are paginated for better viewing.

### Functional Requirements

1. **User Registration**

- The system must allow new users to register.
- The system must validate the email and password during registration.

2. **User Login**

- The system must allow registered users to log in.
- The system must validate user credentials.

3. **Notes Management**

- The system must allow users to create, edit, view, and delete notes.
- The system must validate the note fields (title, description, and color).

4. **Authentication and Authorization**

- The system must use authentication tokens to protect routes.
- The system must store the authentication token in cookies.

### Non-Functional Requirements

1. **Usability**

- The interface should be intuitive and easy to use.
- The design should be responsive and accessible.

2. **Performance**

- The system should handle multiple simultaneous requests.
- The response time of operations should be acceptable for the user.

3. **Security**

- The system must protect user data using HTTPS.
- The system must securely store passwords.

4. **Maintainability**

- The code should be modular and follow best development practices.
- The system should be easy to maintain and update.

### Business Rules

1. **User Registration**

- The email must be unique and valid.
- The password must have at least 8 characters.

2. **User Login**

- The email and password must match a registered user.

3. **Notes Management**

- The note title must be between 3 and 100 characters.
- The note description must be between 10 and 2500 characters.
- The note color must be a valid hexadecimal code.

### Project Structure

The project structure is composed of folders and files organized as follows:

```

notes-app/web
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── styles/
├── .env
├── .gitignore
├── .prettierrc
├── client.http
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

```

### How to Run the Project

1. Clone the repository:

```sh
git clone https://github.com/your-username/notes-app.git
```

2. Install dependencies:

```sh
npm install
```

3. Start the development server:

```sh
npm run dev
```

4. Access the application in your browser:

```sh
http://localhost:3000
```

### Environment Variables Configuration

Create a `.env` file in the project root and add the following environment variables:

```env
## Image display API for climate banner:
## https://unsplash.com/oauth/applications
VITE_UNSPLASH_ACCESS_KEY=""

## Weather monitoring API:
## https://home.openweathermap.org/
VITE_API_OPENWATHER_KEY=""

## Add your production server URL here
VITE_API_SERVER_BACKEND='http://localhost:3000'

```

### Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Zod
- React Hook Form
- React Cookies

## Contribution

use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages.

1. Fork the project.
2. Create a branch for your feature `(git checkout -b feature/new-feature)`.
3. Commit your changes `(git commit -m 'feat: Add new feature')`.
4. Push to the branch `(git push origin feature/new-feature)`.
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This README provides a comprehensive overview of the project, including its features, requirements, business rules, project structure, and execution instructions. Adjust it as necessary to accurately reflect your project's details.
