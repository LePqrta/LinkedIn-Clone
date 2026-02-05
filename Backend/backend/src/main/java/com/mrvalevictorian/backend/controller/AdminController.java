package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.CreateUserRequest;
import com.mrvalevictorian.backend.dto.response.JobResponse;
import com.mrvalevictorian.backend.mapper.EntityMapper;
import com.mrvalevictorian.backend.model.Post;
import com.mrvalevictorian.backend.model.User;
import com.mrvalevictorian.backend.service.AdminService;
import com.mrvalevictorian.backend.service.JobService;
import com.mrvalevictorian.backend.service.PostService;
import com.mrvalevictorian.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;
    private final UserService userService;
    private final PostService postService;
    private final JobService jobService;
    private final EntityMapper mapper;

    @PostMapping("/add-new-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> addAdmin(@RequestBody @Valid CreateUserRequest request) {
        adminService.createUser(request);
        return new ResponseEntity<>("Admin created successfully", HttpStatus.CREATED);
    }

    @GetMapping("/all-users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    @GetMapping("/all-posts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }
    @GetMapping("/all-jobs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<JobResponse>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs().stream().map(mapper::toJobResponse).toList());
    }
    @DeleteMapping("/delete-user/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable String username) {
        userService.deleteUser(username);
        return ResponseEntity.ok("User deleted successfully");
    }
    @DeleteMapping("/delete-post/{postId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deletePost(@PathVariable Long postId) {
        postService.deletePostAdmin(postId);
        return ResponseEntity.ok("Post deleted successfully");
    }
    @DeleteMapping("/delete-job/{jobId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteJob(@PathVariable int jobId) {
        jobService.deleteJobAdmin(jobId);
        return ResponseEntity.ok("Job deleted successfully");
    }
}
