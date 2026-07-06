import './style.css';

const API_URL = '/api/books';

const bookForm = document.querySelector('#bookForm');
const bookIdInput = document.querySelector('#bookId');
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author');
const priceInput = document.querySelector('#price');
const publishedYearInput = document.querySelector('#publishedYear');
const submitButton = document.querySelector('#submitButton');
const resetButton = document.querySelector('#resetButton');
const reloadButton = document.querySelector('#reloadButton');
const message = document.querySelector('#message');
const bookTableBody = document.querySelector('#bookTableBody');

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `요청 실패: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function loadBooks() {
  try {
    const books = await requestJson(API_URL);
    renderBooks(books);
    showMessage('도서 목록을 불러왔습니다.', 'success');
  } catch (error) {
    console.error(error);
    renderEmptyRow('도서 목록을 불러오지 못했습니다.');
    showMessage('백엔드 서버가 실행 중인지 확인하세요.', 'error');
  }
}

function renderBooks(books) {
  bookTableBody.innerHTML = '';

  if (books.length === 0) {
    renderEmptyRow('등록된 도서가 없습니다.');
    return;
  }

  books.forEach((book) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${book.id}</td>
      <td>${escapeHtml(book.title)}</td>
      <td>${escapeHtml(book.author)}</td>
      <td>${formatPrice(book.price)}</td>
      <td>${book.publishedYear}</td>
      <td>
        <button type="button" class="small" data-action="edit" data-id="${book.id}">수정</button>
        <button type="button" class="small danger" data-action="delete" data-id="${book.id}">삭제</button>
      </td>
    `;

    bookTableBody.appendChild(tr);
  });
}

function renderEmptyRow(text) {
  bookTableBody.innerHTML = `
    <tr>
      <td colspan="6">${text}</td>
    </tr>
  `;
}

bookForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const bookId = bookIdInput.value;

  const bookData = {
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    price: Number(priceInput.value),
    publishedYear: Number(publishedYearInput.value)
  };

  if (!validateBook(bookData)) {
    return;
  }

  try {
    if (bookId) {
      await updateBook(bookId, bookData);
      showMessage('도서 정보가 수정되었습니다.', 'success');
    } else {
      await createBook(bookData);
      showMessage('도서가 등록되었습니다.', 'success');
    }

    resetForm();
    await loadBooks();
  } catch (error) {
    console.error(error);
    showMessage('저장 중 오류가 발생했습니다.', 'error');
  }
});

bookTableBody.addEventListener('click', async (event) => {
  const button = event.target.closest('button');

  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === 'edit') {
    await prepareEdit(id);
  }

  if (action === 'delete') {
    await deleteBook(id);
  }
});

resetButton.addEventListener('click', () => {
  resetForm();
  showMessage('입력 폼을 초기화했습니다.', 'success');
});

reloadButton.addEventListener('click', () => {
  loadBooks();
});

async function createBook(bookData) {
  return requestJson(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookData)
  });
}

async function updateBook(id, bookData) {
  return requestJson(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookData)
  });
}

async function prepareEdit(id) {
  try {
    const book = await requestJson(`${API_URL}/${id}`);

    bookIdInput.value = book.id;
    titleInput.value = book.title;
    authorInput.value = book.author;
    priceInput.value = book.price;
    publishedYearInput.value = book.publishedYear;

    submitButton.textContent = '수정';
    titleInput.focus();

    showMessage(`ID ${book.id} 도서를 수정 모드로 불러왔습니다.`, 'success');
  } catch (error) {
    console.error(error);
    showMessage('수정할 도서 정보를 불러오지 못했습니다.', 'error');
  }
}

async function deleteBook(id) {
  const confirmed = window.confirm(`ID ${id} 도서를 삭제하시겠습니까?`);

  if (!confirmed) {
    return;
  }

  try {
    await requestJson(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    showMessage('도서가 삭제되었습니다.', 'success');
    await loadBooks();
  } catch (error) {
    console.error(error);
    showMessage('삭제 중 오류가 발생했습니다.', 'error');
  }
}

function validateBook(bookData) {
  if (!bookData.title) {
    showMessage('도서명을 입력하세요.', 'error');
    titleInput.focus();
    return false;
  }

  if (!bookData.author) {
    showMessage('저자를 입력하세요.', 'error');
    authorInput.focus();
    return false;
  }

  if (Number.isNaN(bookData.price) || bookData.price < 0) {
    showMessage('가격은 0 이상의 숫자로 입력하세요.', 'error');
    priceInput.focus();
    return false;
  }

  if (Number.isNaN(bookData.publishedYear) || bookData.publishedYear < 1900) {
    showMessage('출간연도를 올바르게 입력하세요.', 'error');
    publishedYearInput.focus();
    return false;
  }

  return true;
}

function resetForm() {
  bookIdInput.value = '';
  bookForm.reset();
  submitButton.textContent = '등록';
  titleInput.focus();
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = `message ${type}`;
}

function formatPrice(price) {
  return `${Number(price).toLocaleString('ko-KR')}원`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

loadBooks();