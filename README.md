# honey-headquarters-implementations
Winnie the Pooh Bear stuffed animal collection directory.

When developing, a local mock API server is used, as to not eat up all my free sheetsu account API requests. 
A tool called [json-server](https://github.com/typicode/json-server) is used for this. To use, install globally
using NPM:

```bash
npm install -g json-server
```

...and run the following command from the root project directory to start the server:

```bash
json-server --watch mock-api/mock-api.json
```

The endpoint for the test data will be [http://localhost:3000/citizens]().

The real data endpoint is [https://sheetsu.com/apis/v1.0/64b5c3f8]().