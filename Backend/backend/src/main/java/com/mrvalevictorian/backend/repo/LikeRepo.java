package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepo extends JpaRepository<Like, Long> {

}
