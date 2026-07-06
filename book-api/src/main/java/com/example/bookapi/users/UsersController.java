package com.example.bookapi.users;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UsersService usersService;

    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    @PostMapping
    public ResponseEntity<UsersResponse> createUser(@RequestBody UsersRequest request) {
        UsersResponse response = usersService.createUser(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<UsersResponse>> getAllUsers() {
        List<UsersResponse> response = usersService.getAllUsers();
        return ResponseEntity.ok(response);
    }
}