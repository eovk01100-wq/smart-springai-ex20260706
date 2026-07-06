package com.example.bookapi.users;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class UsersService {

    private final UserRepository userRepository;

    public UsersService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UsersResponse createUser(UsersRequest request) {
        AppUser user = new AppUser(request.username(), request.email(), request.password());
        AppUser savedUser = userRepository.save(user);
        return UsersResponse.from(savedUser);
    }

    public List<UsersResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UsersResponse::from)
                .collect(Collectors.toList());
    }
}