package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface JobRepo extends JpaRepository<Job, Integer> {
    Optional<Object> findByTitle(String title);
}

