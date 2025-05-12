package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.CommentRequest;
import com.mrvalevictorian.backend.exceptions.PostContentEmptyException;
import com.mrvalevictorian.backend.exceptions.UserNotFoundException;
import com.mrvalevictorian.backend.model.Comment;
import com.mrvalevictorian.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@RestController
@RequestMapping("/comment")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    // Add methods to handle comment-related requests here
    // For example, createComment, getComments, deleteComment, etc.

    // Example method
    @PostMapping("/create-comment")
    public ResponseEntity<String> createComment(@RequestBody CommentRequest commentRequest) {
        try {
            commentService.createComment(commentRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body("Comment created successfully");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found: " + e.getMessage());
        } catch (PostContentEmptyException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid content: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-comment/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable Long commentId) {
        try {
            commentService.deleteComment(commentId);
            return ResponseEntity.status(HttpStatus.OK).body("Comment deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/post/{postId}/comments")
    public ResponseEntity<List<Comment>> getCommentsByPost(@PathVariable Long postId) {
        List<Comment> comments = commentService.getCommentsByPost(postId);
        return ResponseEntity.ok(comments);
    }

}
