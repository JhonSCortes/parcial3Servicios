const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Configurar la conexión a MySQL
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'myflaskapp',
});

connection.connect((err) => {
	  if (err) {
		      console.error('Error de conexión a MySQL: ' + err.stack);
		      return;
		    }
	  console.log('Conectado a MySQL como ID ' + connection.threadId);
});

app.use(bodyParser.json());

app.get('/books', (req, res) => {
	  connection.query('SELECT * FROM books', (error, results) => {
		      if (error) throw error;
		      res.json({ books: results });
		    });
});

app.get('/books/:book_id', (req, res) => {
	  const bookId = req.params.book_id;
	  connection.query('SELECT * FROM books WHERE id = ?', [bookId], (error, results) => {
		      if (error) throw error;
		      res.json({ book: results[0] });
		    });
});

app.post('/books', (req, res) => {
	  const { title, description, author } = req.body;
	  connection.query('INSERT INTO books (title, description, author) VALUES (?, ?, ?)', [title, description, author], (error, results) => {
		      if (error) throw error;
		      res.json({ book: { title, description, author, id: results.insertId } });
		    });
});

app.put('/books/:book_id', (req, res) => {
	  const bookId = req.params.book_id;
	  const { title, description, author } = req.body;
	  connection.query('UPDATE books SET title = ?, description = ?, author = ? WHERE id = ?', [title, description, author, bookId], (error, results) => {
		      if (error) throw error;
		      res.json({ book: { title, description, author, id: bookId } });
		    });
});

app.delete('/books/:book_id', (req, res) => {
	  const bookId = req.params.book_id;
	  connection.query('DELETE FROM books WHERE id = ?', [bookId], (error, results) => {
		      if (error) throw error;
		      res.json({ result: true });
		    });
});

app.listen(port, () => {
	  console.log(`Servidor escuchando en http://localhost:${port}`);
	});
