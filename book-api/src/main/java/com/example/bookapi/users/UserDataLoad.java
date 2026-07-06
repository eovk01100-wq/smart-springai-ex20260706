package com.example.bookapi.users;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class UserDataLoad implements CommandLineRunner {

    private final UserRepository userRepository;

    public UserDataLoad(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            userRepository.save(new AppUser("홍길동", "hong@example.com", "1234"));
            userRepository.save(new AppUser("김개발", "kim@example.com", "1234"));
            userRepository.save(new AppUser("이자바", "lee@example.com", "1234"));
            System.out.println("=== 초기 회원 데이터 3명이 성공적으로 추가되었습니다. ===");
        }
    }
}