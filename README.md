# Todos App with working minute

This is a simple todos app that allows you to manage your work.

You should run this app in your local environment with json-server.

**Do not publish** this app on cloud for security reason.

## Project setup

1. `git clone` or download this repository.

2. Install json-server globally.

```
npm install -g json-server
```

3. `npm install`

```
npm install
```

4. Create a new file `db.json` in the project's root directory.

And add below object.

```
{
  "projects": []
}
```

5. It's done. Let's start this app with custom npm scripts.

```
npm run start
```

You can see running json-server and development server.

When you access `http://localhost:8080/` on your browser, you can use this app.
