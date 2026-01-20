package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.PostingRequest;
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
        postService.createPost(postRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("Post created successfully");
    }
    @DeleteMapping("/delete-post/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable Long postId) {
        postService.deletePost(postId);
        return ResponseEntity.status(HttpStatus.OK).body("Post deleted successfully");
    }
    @PutMapping("/edit-post/{postId}")
    public ResponseEntity<String> editPost(@PathVariable Long postId, @RequestBody Map<String, String> requestBody) {
        String newContent = requestBody.get("content");
        postService.editPost(postId, newContent);
        return ResponseEntity.status(HttpStatus.OK).body("Post updated successfully");
    }
    @GetMapping("/get-profile-posts/{profileId}")
    public List<Post> getPostsByProfileId(@PathVariable Long profileId) {
        return postService.getPostsByProfileId(profileId);
    }
    @GetMapping("/get-posts-of-connections")
    public ResponseEntity<List<Post>> getPostsOfConnections() {
        List<Post> posts = postService.getPostsOfConnections();
        return ResponseEntity.ok(posts);
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

    // Admin post delete

}