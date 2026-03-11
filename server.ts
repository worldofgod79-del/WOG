import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import path from 'path';

const db = new Database('bible.db');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bnumber INTEGER,
    name TEXT,
    testament TEXT
  );

  CREATE TABLE IF NOT EXISTS verses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER,
    chapter INTEGER,
    verse INTEGER,
    text TEXT,
    FOREIGN KEY (book_id) REFERENCES books(id)
  );

  CREATE INDEX IF NOT EXISTS idx_verses_search ON verses(text);
`);

// Function to seed database from XML if it exists
function seedDatabase() {
  const xmlPath = path.join(process.cwd(), 'bible.xml');
  if (!fs.existsSync(xmlPath)) {
    console.log('bible.xml not found. Skipping seeding.');
    return;
  }

  const rowCount = db.prepare('SELECT count(*) as count FROM verses').get() as { count: number };
  if (rowCount.count > 0) {
    console.log('Database already seeded.');
    return;
  }

  console.log('Seeding database from bible.xml...');
  const xmlData = fs.readFileSync(xmlPath, 'utf-8');
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
  const jsonObj = parser.parse(xmlData);

  const bibleBooks = jsonObj.XMLBIBLE.BIBLEBOOK;
  const booksArray = Array.isArray(bibleBooks) ? bibleBooks : [bibleBooks];

  const insertBook = db.prepare('INSERT INTO books (bnumber, name, testament) VALUES (?, ?, ?)');
  const insertVerse = db.prepare('INSERT INTO verses (book_id, chapter, verse, text) VALUES (?, ?, ?, ?)');

  console.log(`Found ${booksArray.length} books. Starting transaction...`);
  
  const transaction = db.transaction(() => {
    let totalVerses = 0;
    for (const book of booksArray) {
      const bnumber = parseInt(book.bnumber);
      const bname = book.bname;
      const testament = bnumber <= 39 ? 'Old' : 'New';
      
      const result = insertBook.run(bnumber, bname, testament);
      const bookId = result.lastInsertRowid;

      const chapters = Array.isArray(book.CHAPTER) ? book.CHAPTER : [book.CHAPTER];
      for (const chapter of chapters) {
        const cnumber = parseInt(chapter.cnumber);
        const verses = Array.isArray(chapter.VERS) ? chapter.VERS : [chapter.VERS];
        for (const verse of verses) {
          const vnumber = parseInt(verse.vnumber);
          const vtext = verse['#text'] || verse; // Handle different XML structures
          insertVerse.run(bookId, cnumber, vnumber, typeof vtext === 'string' ? vtext : JSON.stringify(vtext));
          totalVerses++;
        }
      }
      if (bnumber % 10 === 0) console.log(`Processed book ${bnumber}: ${bname}...`);
    }
    return totalVerses;
  });

  const count = transaction();
  console.log(`Seeding complete! Total verses: ${count}`);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  seedDatabase();

  // API Routes
  app.get('/api/bible/books', (req, res) => {
    const books = db.prepare('SELECT * FROM books ORDER BY bnumber').all();
    res.json(books);
  });

  app.get('/api/bible/chapters/:bookId', (req, res) => {
    const chapters = db.prepare('SELECT DISTINCT chapter FROM verses WHERE book_id = ? ORDER BY chapter').all(req.params.bookId);
    res.json(chapters.map((c: any) => c.chapter));
  });

  app.get('/api/bible/verses/:bookId/:chapter', (req, res) => {
    const verses = db.prepare('SELECT * FROM verses WHERE book_id = ? AND chapter = ? ORDER BY verse').all(req.params.bookId, req.params.chapter);
    res.json(verses);
  });

  app.get('/api/bible/search', (req, res) => {
    const query = req.query.q;
    if (!query || typeof query !== 'string') return res.json([]);
    const results = db.prepare(`
      SELECT v.*, b.name as book_name 
      FROM verses v 
      JOIN books b ON v.book_id = b.id 
      WHERE v.text LIKE ? 
      LIMIT 50
    `).all(`%${query}%`);
    res.json(results);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
