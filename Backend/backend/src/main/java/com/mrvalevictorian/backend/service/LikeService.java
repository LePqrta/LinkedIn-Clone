package com.mrvalevictorian.backend.service;

import com.mrvalevictorian.backend.dto.LikeRequest;
import com.mrvalevictorian.backend.exceptions.UserNotFoundException;
import com.mrvalevictorian.backend.model.Like;
import com.mrvalevictorian.backend.model.Post;
import com.mrvalevictorian.backend.model.User;
import com.mrvalevictorian.backend.repo.LikeRepo;
import com.mrvalevictorian.backend.repo.PostRepo;
import com.mrvalevictorian.backend.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepo likeRepo;
    private final UserRepo userRepo;
    private final PostRepo postRepo;
    private final JwtService jwtService;

    // Implement the logic for liking a post
    public String likePost(LikeRequest request) {
        Post post = postRepo.findPostByPostId(request.postId())
                .orElseThrow(() -> new RuntimeException("Post with ID " + request.postId() + " not found"));

        String username = jwtService.extractUser(jwtService.getToken());
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User with username " + username + " not found"));

        Optional<Like> existingLike = likeRepo.findByPostIdAndUserId(request.postId(), user.getId());
        if (existingLike.isPresent()) {
            likeRepo.delete(existingLike.get());
            return "Unliked";
        } else {
            var newLike = Like.builder()
                    .post(post)
                    .user(user)
                    .build();
            likeRepo.save(newLike);
            return "Liked";
        }
    }

    public Long getLikesCount(Long postId) {
        return likeRepo.countAllByPostId(postId);
    }


}
