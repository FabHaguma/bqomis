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

    public List<UserDTO> findAll() {
        return userRepository.findAll().stream()
                .map(mapperUtil::toUserDTO)
                .toList();
    }

    public Optional<UserDTO> findById(Long id) {
        return userRepository.findById(id)
                .map(mapperUtil::toUserDTO);
    }

    public UserDTO save(User user) {
        // Check if the user already exists
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null && !existingUser.getId().equals(user.getId())) {
            throw new RuntimeException("User with this email already exists");
        }

        // Hash the password before saving
        if (user.getPassword() != null) {
            user.setPassword(hashPassword(user.getPassword()));
        }
        User savedUser = userRepository.save(user);
        return mapperUtil.toUserDTO(savedUser);
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

    public List<UserDTO> findByRoles(List<String> roles) {
        // Use a custom query if needed, but for now use stream filtering
        List<User> users = userRepository.findByRoleIn(roles);
        if (users.isEmpty()) {
            return List.of(); // Return an empty list if no users found
        }
        return users.stream()
                .map(mapperUtil::toUserDTO)
                .toList();
    }

    public UserDTO partiallyUpdateUser(Long id, User user) {
        Optional<User> existingUserOpt = userRepository.findById(id);
        if (existingUserOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User existingUser = existingUserOpt.get();
        // Only update fields that are not null in the request
        if (user.getUsername() != null)
            existingUser.setUsername(user.getUsername());
        if (user.getEmail() != null)
            existingUser.setEmail(user.getEmail());
        if (user.getRole() != null)
            existingUser.setRole(user.getRole());
        if (user.getPhoneNumber() != null)
            existingUser.setPhoneNumber(user.getPhoneNumber());
        if (user.getProfilePicture() != null)
            existingUser.setProfilePicture(user.getProfilePicture());
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            existingUser.setPassword(hashPassword(user.getPassword()));
        }
        return mapperUtil.toUserDTO(userRepository.save(existingUser));
    }

    public UserDTO updateUser(Long id, User user) {
        Optional<User> existingUserOpt = userRepository.findById(id);
        if (existingUserOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User existingUser = existingUserOpt.get();
        // Update all fields
        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        existingUser.setRole(user.getRole());
        existingUser.setPhoneNumber(user.getPhoneNumber());
        existingUser.setProfilePicture(user.getProfilePicture());
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            existingUser.setPassword(hashPassword(user.getPassword()));
        }
        return mapperUtil.toUserDTO(userRepository.save(existingUser));
    }

    private String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }

}