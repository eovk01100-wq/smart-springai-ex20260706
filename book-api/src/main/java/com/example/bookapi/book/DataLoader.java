package com.example.bookapi.book;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initData(BookRepository bookRepository) {
        return args -> {
            if (bookRepository.count() == 0) {
                bookRepository.save(new Book("스프링 부트 입문", "홍길동", 30000, 2026));
                bookRepository.save(new Book("처음 배우는 REST API", "김개발", 28000, 2025));
                bookRepository.save(new Book("실무 JPA 기초", "이자바", 35000, 2024));
            }
        };
    }
}