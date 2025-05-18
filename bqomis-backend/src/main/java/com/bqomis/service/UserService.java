package com.bqomis.service;

import com.bqomis.dto.UserDTO;
import com.bqomis.model.User;
import com.bqomis.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.bqomis.util.MapperUtil;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private MapperUtil mapperUtil;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User save(User user) {
        // Check if the user already exists
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null && !existingUser.getId().equals(user.getId())) {
            throw new RuntimeException("User with this email already exists");
        }

        // Hash the password before saving
        if (user.getPassword() != null) {
            user.setPassword(hashPassword(user.getPassword()));
        }
        return userRepository.save(user);
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    public UserDTO authenticate(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return null; // User not found
        }
        // Compare the hashed password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return null; // Password does not match
        }
        return mapperUtil.toUserDTO(user); // Authentication successful
    }

    public boolean changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return false;
        }
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return false;
        }
        user.setPassword(hashPassword(newPassword));
        userRepository.save(user);
        return true;
    }

    private String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }

}