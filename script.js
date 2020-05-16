//Book Class:Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
//UI Change:Handle UI Class
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(book => UI.addBookToList(book));
    }
    static addBookToList(book) {
        const list = document.getElementById('book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">Del</a></td>
        `;
        list.appendChild(row);

    }
    static deleteBook(book) {
        if (book.classList.contains('delete')) {
            book.parentElement.parentElement.remove();
        }
    }
    static showAlerts(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-dismissible alert-${className}`
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        //Vanish the message
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
    static clearInputs() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

}
//Handle Input Storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}
//Event:Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);


//Event:Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //Fetch Form Values
    e.preventDefault();
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    //Validate
    if (title === '' || author === '' || isbn === '') {
        UI.showAlerts('Fields cannot be empty', 'warning');
    }
    else {
        const newBook = new Book(title, author, isbn);
        //console.log(newBook);
        UI.addBookToList(newBook); //Add To UI
        Store.addBook(newBook); //Add to Storage
        UI.showAlerts('Book Added Successfully', 'success');
        //Clear after submit
        UI.clearInputs();
    }
});


//Event:Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    console.log(e.target);
    UI.deleteBook(e.target); //Remove from UI
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent); //Remove from store
    UI.showAlerts('Book Deleted Successfully', 'danger');
});