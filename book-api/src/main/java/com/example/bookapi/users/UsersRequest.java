package com.example.bookapi.users;

public record UsersRequest(
    String username,
    String email,
    String password
) {}