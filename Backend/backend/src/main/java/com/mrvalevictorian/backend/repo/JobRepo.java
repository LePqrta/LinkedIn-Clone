package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;


public interface JobRepo extends JpaRepository<Job, Integer> {
}

