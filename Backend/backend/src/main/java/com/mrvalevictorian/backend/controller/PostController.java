package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.PostingRequest;
import com.mrvalevictorian.backend.dto.response.PostResponse;
import com.mrvalevictorian.backend.mapper.AppMapper;
import com.mrvalevictorian.backend.service.PostService;
import jakarta.validation.Valid;
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
    private final AppMapper mapper;
    @PostMapping("/create-post")
    public ResponseEntity<String> createPost(@RequestBody @Valid PostingRequest postRequest) {
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
    public List<PostResponse> getPostsByProfileId(@PathVariable Long profileId) {
        return postService.getPostsByProfileId(profileId).stream().map(mapper::toPostResponse).toList();
    }
    @GetMapping("/get-posts-of-connections")
    public ResponseEntity<List<PostResponse>> getPostsOfConnections() {
        return ResponseEntity.ok(
                postService.getPostsOfConnections()
                        .stream()
                        .map(mapper::toPostResponse)
                        .toList()
        );
    }

    @GetMapping
    public List<PostResponse> getAllPostsOfUser() {
        return postService.getAllPosts().stream().map(mapper::toPostResponse).toList();
    }


}