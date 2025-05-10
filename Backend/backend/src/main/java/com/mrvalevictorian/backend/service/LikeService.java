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
    public void likePost(LikeRequest request) {
        Optional<Post> postOptional = postRepo.findPostByPostId(request.getPostId());
        if (postOptional.isEmpty()) {
            throw new RuntimeException("Post not found");
        }
        Post post = postOptional.get();
        String username = jwtService.extractUser(jwtService.getToken());
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        // Check if the user has already liked the post
        Optional<Like> existingLike = likeRepo.findByPostIdAndUserId(request.getPostId(), user.getId());
        if (existingLike.isPresent()) {
            // If the user has already liked the post, remove the like
            likeRepo.delete(existingLike.get());
        } else {
            // If the user has not liked the post, add a new like
            Like like = new Like();
            like.setPost(post);
            like.setUser(user);
            likeRepo.save(like);
        }
    }

    public Optional<Long> getLikesCount(LikeRequest likeRequest) {
        // Logic to get the count of likes for a post

        return likeRepo.countAllByPostId(likeRequest.getPostId());
    }


}
