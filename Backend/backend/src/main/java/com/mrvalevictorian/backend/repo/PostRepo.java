package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface PostRepo extends JpaRepository<Post, UUID> {

}
