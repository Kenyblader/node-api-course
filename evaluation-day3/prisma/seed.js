import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
    const ROUND_SALT = 10;
  await prisma.user.createMany({
    data: [
      {
        nom: 'Alice',
        email: 'alice@example.com',
        password: await hash('password1', ROUND_SALT), 
        role: 'user'
      },
      {
        nom: 'Bob',
        email: 'bob@example.com',
        password: await hash('password2', ROUND_SALT),
        role: 'user'
      }
    ]
  });

  await prisma.livre.createMany({
    data: [
      { titre: 'Livre 1', auteur: 'Auteur 1', annee: 2001, genre: 'Roman' },
      { titre: 'Livre 2', auteur: 'Auteur 2', annee: 2002, genre: 'Policier' },
      { titre: 'Livre 3', auteur: 'Auteur 3', annee: 2003, genre: 'Science-fiction' },
      { titre: 'Livre 4', auteur: 'Auteur 4', annee: 2004, genre: 'Fantastique' },
      { titre: 'Livre 5', auteur: 'Auteur 5', annee: 2005, genre: 'Biographie' },
      { titre: 'Livre 6', auteur: 'Auteur 6', annee: 2006, genre: 'Essai' },
      { titre: 'Livre 7', auteur: 'Auteur 7', annee: 2007, genre: 'Roman' },
      { titre: 'Livre 8', auteur: 'Auteur 8', annee: 2008, genre: 'Conte' },
      { titre: 'Livre 9', auteur: 'Auteur 9', annee: 2009, genre: 'Poésie' },
      { titre: 'Livre 10', auteur: 'Auteur 10', annee: 2010, genre: 'Théâtre' }
    ]
  });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());