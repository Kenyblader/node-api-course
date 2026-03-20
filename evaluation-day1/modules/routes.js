import { readDB, writeDB } from "./db.js";

const sendJSON = (res, status, data) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const booksRoutes = async (req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    if (parsedUrl.pathname === "/books") {
      if (req.method === "GET") {
        const datas = await readDB();
        let books = datas.books;

         if (parsedUrl.searchParams.get("available") === "true") {
          books = books.filter(b => b.available === true);
        }

        return sendJSON(res, 200, {
          success: true,
          count: books.length,
          data: books,
        });
      }

      if (req.method === "POST") {
        let body = "";

        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", async () => {
          const newBook = JSON.parse(body);

          if (!newBook.title || !newBook.author || !newBook.year) {
            return sendJSON(res, 400, {
              success: false,
              error: "Les champs title, author et year sont requis",
            });
          }

          const datas = await readDB();

          newBook.id =
            datas.books.length > 0
              ? datas.books[datas.books.length - 1].id + 1
              : 1;

          newBook.available =  true;

          datas.books.push(newBook);
          await writeDB(datas);

          return sendJSON(res, 201, {
            success: true,
            data: newBook,
          });
        });

        return;
      }

      return sendJSON(res, 405, { error: "Méthode non autorisée" });
    }

    const match = parsedUrl.pathname.match(/^\/books\/([^\/]+)$/);
    if (match) {
        const id = parseInt(match[1]);
      if (req.method === "GET") {
        
        const datas = await readDB();
        const book = datas.books.find((b) => b.id === id);

        if (!book) {
          return sendJSON(res, 404, {
            success: false,
            error: "livre introuvable",
          });
        }

        return sendJSON(res, 200, {
          success: true,
          data: book,
        });
      }
      if (req.method === "DELETE") {
        const datas = await readDB();
        const bookIndex = datas.books.findIndex((b) => b.id === id);

        if (bookIndex === -1) {
          return sendJSON(res, 404, {
            success: false,
            error: "livre introuvable",
          });
        }

        datas.books.splice(bookIndex, 1);
        await writeDB(datas);

        return sendJSON(res, 204);
      }

      return sendJSON(res, 405, { error: "Méthode non autorisée" });
    }

    return sendJSON(res, 404, {
      success: false,
      error: "cette route n'existe pas",
    });
  } catch (error) {
    console.error(error);
    return sendJSON(res, 500, {
      success: false,
      error: "Erreur interne du serveur",
    });
  } finally {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} -> ${res.statusCode}`
    );
  }
};

export { booksRoutes };