package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;


public interface TopicRepo extends JpaRepository<Topic, Long> {
}
