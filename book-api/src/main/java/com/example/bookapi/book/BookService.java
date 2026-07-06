package com.example.bookapi.book;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<BookResponse> findAll() {
        return bookRepository.findAll()
                .stream()
                .map(BookResponse::from)
                .toList();
    }

    public BookResponse findById(Long id) {
        Book book = getBook(id);
        return BookResponse.from(book);
    }

    @Transactional
    public BookResponse create(BookRequest request) {
        Book book = new Book(
                request.title(),
                request.author(),
                request.price(),
                request.publishedYear()
        );

        Book savedBook = bookRepository.save(book);
        return BookResponse.from(savedBook);
    }

    @Transactional
    public BookResponse update(Long id, BookRequest request) {
        Book book = getBook(id);

        book.setTitle(request.title());
        book.setAuthor(request.author());
        book.setPrice(request.price());
        book.setPublishedYear(request.publishedYear());

        Book savedBook = bookRepository.save(book);
        return BookResponse.from(savedBook);
    }

    @Transactional
    public void delete(Long id) {
        Book book = getBook(id);
        bookRepository.delete(book);
    }

    private Book getBook(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "도서를 찾을 수 없습니다. id=" + id
                ));
    }
}