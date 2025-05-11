package com.mrvalevictorian.backend.controller;


import com.mrvalevictorian.backend.dto.LikeRequest;
import com.mrvalevictorian.backend.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/like")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/like-post")
    public ResponseEntity<String> likePost(@RequestBody LikeRequest request) {
        String result = likeService.likePost(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/post/{postId}/like-count")
    public ResponseEntity<Long> getLikeCount(@PathVariable Long postId) {
        Long likeCount = likeService.getLikesCount(postId);
        return ResponseEntity.ok(likeCount);
    }

}
