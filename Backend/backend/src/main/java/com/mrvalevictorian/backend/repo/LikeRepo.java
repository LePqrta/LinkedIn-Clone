package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LikeRepo extends JpaRepository<Like, Long> {
    @Query("SELECT COUNT(l) FROM Like l WHERE l.post.postId = ?1")
    Long countAllByPostId(Long postId);


    @Query("SELECT l FROM Like l WHERE l.post.postId = ?1 AND l.user.id = ?2")
    Optional<Like> findByPostIdAndUserId(Long postId, UUID userId);


}
