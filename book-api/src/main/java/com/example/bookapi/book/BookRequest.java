package com.example.bookapi.book;

public record BookRequest(
        String title,
        String author,
        Integer price,
        Integer publishedYear
) {
}
