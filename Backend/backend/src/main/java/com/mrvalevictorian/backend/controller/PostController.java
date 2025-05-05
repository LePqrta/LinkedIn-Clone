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
import java.util.UUID;

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

    // to test if the controller is working
    @GetMapping("/test")
    public ResponseEntity<String> createPost() {
        return ResponseEntity.status(HttpStatus.CREATED).body("Post created successfully");
    }

    @GetMapping
    public List<Post> getAllPostsOfUser() {
        return postService.getAllPosts();
    }

    @GetMapping("/{id}")
    public Post getPostById(@PathVariable String id) {
        return postService.getPostById(UUID.fromString(id));
    }
}