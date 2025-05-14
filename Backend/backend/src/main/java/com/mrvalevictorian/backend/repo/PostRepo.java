package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PostRepo extends JpaRepository<Post, Long> {
    @Query("SELECT p FROM Post p WHERE p.postId=?1")
    Optional<Post> findPostByPostId(Long postId);

    @Query("SELECT po FROM Profile p JOIN Post po ON p.user = po.user WHERE p.profileId = :profileId")
    List<Post> findPostByProfileId(@Param("profileId") Long profileId);

    @Query("SELECT po FROM Post po WHERE po.user.id IN (" +
               "SELECT CASE WHEN c.sender.id = :userId THEN c.receiver.id ELSE c.sender.id END " +
               "FROM Connection c WHERE c.status='ACCEPTED' and c.sender.id = :userId OR c.receiver.id = :userId)")
        List<Post> findPostsOfConnections(@Param("userId") UUID userId);
}
