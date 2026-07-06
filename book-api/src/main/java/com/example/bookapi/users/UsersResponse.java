package com.example.bookapi.users;

public record UsersResponse(
    Long id,
    String username,
    String email
) {
    public static UsersResponse from(AppUser user) {
        return new UsersResponse(user.getId(), user.getUsername(), user.getEmail());
    }
}