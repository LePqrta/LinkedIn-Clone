package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.PostingRequest;
import com.mrvalevictorian.backend.exceptions.UserNotFoundException;
import com.mrvalevictorian.backend.exceptions.PostContentEmptyException;
import com.mrvalevictorian.backend.model.Post;
import com.mrvalevictorian.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/post")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;
    @PostMapping("/create-post")
    public ResponseEntity<String> createPost(@RequestBody PostingRequest postRequest) {
        try {
            postService.createPost(postRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body("Post created successfully");
        }catch (UserNotFoundException | PostContentEmptyException e){
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
    @DeleteMapping("/delete-post/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable Long postId) {
        try {
            postService.deletePost(postId);
            return ResponseEntity.status(HttpStatus.OK).body("Post deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        }
    }
    @PutMapping("/edit-post/{postId}")
    public ResponseEntity<String> editPost(@PathVariable Long postId, @RequestBody Map<String, String> requestBody) {
        try {
            String newContent = requestBody.get("content");
            postService.editPost(postId, newContent);
            return ResponseEntity.status(HttpStatus.OK).body("Post updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        }
    }
    @GetMapping("/get-profile-posts/{profileId}")
    public List<Post> getPostsByProfileId(@PathVariable Long profileId) {
        try {
            return postService.getPostsByProfileId(profileId);
        } catch (RuntimeException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
    @GetMapping("/get-posts-of-connections")
    public ResponseEntity<List<Post>> getPostsOfConnections() {
        try {
            List<Post> posts = postService.getPostsOfConnections();
            return ResponseEntity.ok(posts);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // to test if the controller is working
    @GetMapping("/test")
    public Post getPostById() {
        return postService.getPostById(1L);
    }

    @GetMapping
    public List<Post> getAllPostsOfUser() {
        return postService.getAllPosts();
    }

}