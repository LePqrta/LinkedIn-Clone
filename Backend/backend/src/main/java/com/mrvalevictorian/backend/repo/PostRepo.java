package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepo extends JpaRepository<Post, Long> {
    @Query("SELECT p FROM Post p WHERE p.postId=?1")
    Optional<Post> findPostByPostId(Long postId);

    @Query("SELECT po FROM Profile p JOIN Post po ON p.user = po.user WHERE p.profileId = :profileId")
    List<Post> findPostByProfileId(@Param("profileId") Long profileId);

}
