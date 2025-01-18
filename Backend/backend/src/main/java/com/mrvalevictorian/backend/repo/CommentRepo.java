package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepo extends JpaRepository<Comment, Long> {

}
