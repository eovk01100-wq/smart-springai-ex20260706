package com.example.bookapi.users;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// 인터페이스 이름을 파일명과 똑같이 UserRepository로 맞춥니다.
public interface UserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);
}