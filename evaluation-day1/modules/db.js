import fs from 'fs';
import path from 'path';

const dbPath = path.join('./', 'db.json');

const writeDB = async (data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(dbPath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const readDB = async () => {
  return new Promise((resolve, reject) => {
    fs.readFile(dbPath, 'utf-8', (err, data) => {
      if (err) {
        console.error("Erreur lors de la lecture du fichier :", err);
        resolve({ books: [] }); // Si le fichier n'existe pas, on retourne une base de données vide
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

export { writeDB, readDB };
