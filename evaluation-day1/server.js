import http from 'http';
import { booksRoutes } from './modules/routes.js';

const server = http.createServer((req, res) => {
  booksRoutes(req, res);
});


server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
