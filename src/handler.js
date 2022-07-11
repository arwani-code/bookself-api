/* eslint-disable no-trailing-spaces */
/* eslint-disable no-else-return */
/* eslint-disable keyword-spacing */
/* eslint-disable quotes */
/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid();
  const finished = pageCount == readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  const checkInputName = name == "" || name == undefined;
  const isPageRead = readPage > pageCount;

  if (checkInputName) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (isPageRead) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id == id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: "error",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  const booksByRequestName = [];
  const booksByRequestRead = [];
  const booksByRequestReadFalse = [];
  const booksByRequestFinish = [];
  const booksByRequestFinishFalse = [];

  const isEmptyBook = books.length == 0;

  const mapBooks = books.map((book) => {
    if (name != undefined) {
      if (book.name.toLowerCase().indexOf(name.toLowerCase()) >= 0) {
        booksByRequestName.push({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        });
      }
    }

    if (reading != undefined) {
      if (reading == 1 && book.reading) {
        booksByRequestRead.push({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        });
      }
      if (reading == 0 && book.reading == false) {
        booksByRequestReadFalse.push({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        });
      }
    }

    if (finished != undefined) {
      if (finished == 1 && book.finished) {
        booksByRequestFinish.push({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        });
      }
      if (finished == 0 && book.finished == false) {
        booksByRequestFinishFalse.push({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        });
      }
    }

    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    };
  });

  if (booksByRequestName.length > 0) {
    const response = h.response({
      status: "success",
      data: {
        books: booksByRequestName,
      },
    });
    response.code(200);
    return response;
  }

  if (booksByRequestRead.length > 0) {
    const response = h.response({
      status: "success",
      data: {
        books: booksByRequestRead,
      },
    });
    response.code(200);
    return response;
  }

  if (booksByRequestReadFalse.length > 0) {
    const response = h.response({
      status: "success",
      data: {
        books: booksByRequestReadFalse,
      },
    });
    response.code(200);
    return response;
  }

  if (booksByRequestFinish.length > 0) {
    const response = h.response({
      status: "success",
      data: {
        books: booksByRequestFinish,
      },
    });
    response.code(200);
    return response;
  }

  if (booksByRequestFinishFalse.length > 0) {
    const response = h.response({
      status: "success",
      data: {
        books: booksByRequestFinishFalse,
      },
    });
    response.code(200);
    return response;
  }

  if (!isEmptyBook) {
    const response = h.response({
      status: "success",
      data: {
        books: mapBooks,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "success",
    data: {
      books: [],
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((book) => book.id == bookId);

  if (book.length == 1) {
    const response = h.response({
      status: "success",
      data: {
        book: book[0],
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const editBookbyIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const finished = pageCount == readPage;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id == bookId);
  const checkInputName = name == "" || name == undefined;

  if (checkInputName) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  if (index != -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id == bookId);

  if (index != -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookbyIdHandler,
  deleteBookByIdHandler,
};
