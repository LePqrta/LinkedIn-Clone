package com.mrvalevictorian.backend.service;

import com.mrvalevictorian.backend.dto.CommentRequest;
import com.mrvalevictorian.backend.exceptions.CommentNotFoundException;
import com.mrvalevictorian.backend.exceptions.PostContentEmptyException;
import com.mrvalevictorian.backend.exceptions.UserNotFoundException;
import com.mrvalevictorian.backend.model.Comment;
import com.mrvalevictorian.backend.model.Post;
import com.mrvalevictorian.backend.model.User;
import com.mrvalevictorian.backend.repo.CommentRepo;
import com.mrvalevictorian.backend.repo.PostRepo;
import com.mrvalevictorian.backend.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final UserRepo userRepo;
    private final JwtService jwtService;
    private final CommentRepo commentRepo;
    private final PostRepo postRepo;

    public void createComment(CommentRequest commentRequest) {
        Post post = postRepo.findPostByPostId(commentRequest.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (commentRequest.getContent() == null || commentRequest.getContent().isEmpty()) {
            throw new PostContentEmptyException("Content cannot be null or empty");
        }

        String username = jwtService.extractUser(jwtService.getToken());
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Comment comment = new Comment();
        comment.setContent(commentRequest.getContent());
        comment.setPost(post);
        comment.setUser(user);
        comment.setCreatedAt(LocalDateTime.now());
        commentRepo.save(comment);
    }

    public void deleteComment(Long commentId) {
        // Yorumun varlığını kontrol et
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException("Comment with ID " + commentId + " not found"));

        // JWT'den kullanıcı adını al
        String username = jwtService.extractUser(jwtService.getToken());

        // Yorumun sahibiyle eşleşme kontrolü
        if (!comment.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to delete this comment");
        }

        // Yorum bulundu ve yetki kontrolü geçtiyse sil
        commentRepo.delete(comment);
    }

    public List<Comment> getCommentsByPost(Long postId) {
        Post post = postRepo.findPostByPostId(postId)
                .orElseThrow(() -> new RuntimeException("Post with ID " + postId + " not found"));
        return commentRepo.findByPost_PostId(postId);
    }

}
