package com.bqomis.controller;

import com.bqomis.dto.UserDTO;
import com.bqomis.model.User;
import com.bqomis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        // GET /api/users
        // This will return all users
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping(params = "roles")
    public ResponseEntity<List<UserDTO>> getUsersByRoles(@RequestParam("roles") String roles) {
        // GET /api/users?roles=STAFF,ADMIN
        // Split roles by comma and trim whitespace
        String[] roleArray = roles.split(",");
        List<String> roleList = java.util.Arrays.stream(roleArray)
                .map(String::trim)
                .toList();
        List<UserDTO> users = userService.findByRoles(roleList);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<UserDTO>> getUserById(@PathVariable Long id) {
        // GET /api/users/{id}
        // This will return a user by ID
        return ResponseEntity.ok(userService.findById(id));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<UserDTO> authenticate(@RequestBody User user) {
        // POST /api/users/authenticate
        // This will authenticate a user
        UserDTO userDTO = userService.authenticate(user.getEmail(), user.getPassword());
        return ResponseEntity.ok(userDTO);
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody User user) {
        // POST /api/users
        // This will create a new user
        return ResponseEntity.ok(userService.save(user));
    }

    @PostMapping("/batch")
    public ResponseEntity<List<UserDTO>> createMultipleUsers(@RequestBody List<User> users) {
        // POST /api/users/batch
        // This will create multiple users at once
        List<UserDTO> createdUsers = users.stream()
                .map(userService::save)
                .toList();
        return ResponseEntity.ok(createdUsers);
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestParam String email, @RequestParam String oldPassword,
            @RequestParam String newPassword) {
        // POST /api/users/change-password
        // This will change the password of a user
        boolean changed = userService.changePassword(email, oldPassword, newPassword);
        if (changed) {
            return ResponseEntity.ok("Password changed successfully");
        } else {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserDTO> partiallyUpdateUser(@PathVariable Long id, @RequestBody User user) {
        // PATCH /api/users/{id}
        // This will partially update an existing user by ID
        UserDTO updatedUser = userService.partiallyUpdateUser(id, user);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody User user) {
        // PUT /api/users/{id}
        // This will fully update an existing user by ID
        UserDTO updatedUser = userService.updateUser(id, user);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        // DELETE /api/users/{id}
        // This will delete a user by ID
        userService.deleteById(id);
    }
}