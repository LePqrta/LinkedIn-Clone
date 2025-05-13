package com.mrvalevictorian.backend.service;

import com.mrvalevictorian.backend.dto.PostingRequest;
import com.mrvalevictorian.backend.exceptions.UserNotFoundException;
import com.mrvalevictorian.backend.exceptions.PostContentEmptyException;
import com.mrvalevictorian.backend.exceptions.PostNotFoundException;
import com.mrvalevictorian.backend.model.Post;
import com.mrvalevictorian.backend.model.User;
import com.mrvalevictorian.backend.repo.PostRepo;
import com.mrvalevictorian.backend.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepo postRepo;
    private final JwtService jwtService;
    private final UserRepo userRepo;
    // post creation
    public void createPost(PostingRequest postingRequest) {
        if (postingRequest.getContent() == null || postingRequest.getContent().isEmpty()) {
            throw new PostContentEmptyException("Content cannot be null or empty");
        }
        // get the current token from the service to match the post to the current user
        String username = jwtService.extractUser(jwtService.getToken());
        // find the user by username, if exists, set the user, if not, throw an exception
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        Post post = new Post();
        post.setContent(postingRequest.getContent());
        post.setUser(user);
        post.setCreatedAt(LocalDateTime.now());
        postRepo.save(post);
    }

    public void deletePost(Long postId) {
        // Post'un varlığını kontrol et
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post with ID " + postId + " not found"));

        // JWT'den kullanıcı adını al
        String username = jwtService.extractUser(jwtService.getToken());

        // Postun sahibiyle eşleşme kontrolü
        if (!post.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to delete this post");
        }

        // Post bulundu ve yetki kontrolü geçtiyse sil
        postRepo.delete(post);
    }
    public void editPost(Long postId, String newContent) {
        // Post'un varlığını kontrol et
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post with ID " + postId + " not found"));

        // JWT'den kullanıcı adını al
        String username = jwtService.extractUser(jwtService.getToken());

        // Postun sahibiyle eşleşme kontrolü
        if (!post.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to edit this post");
        }

        // Yeni içeriği ayarla ve kaydet
        post.setContent(newContent);
        postRepo.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepo.findAll();
    }
    public Post getPostById(Long id) {
        return postRepo.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
    }
    public List<Post> getPostsByProfileId(Long profileId)
    {
        return postRepo.findPostByProfileId(profileId);
    }
    public List<Post> getPostsOfConnections(){
        String username = jwtService.extractUser(jwtService.getToken());
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return postRepo.findPostsOfConnections(user.getId());
    }
}