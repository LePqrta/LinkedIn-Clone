package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface ApplicationRepo extends JpaRepository<Application, Integer> {
    @Query("SELECT a FROM Application a WHERE a.user.id = :userId AND a.job.id = :jobId")
    Optional<Application> findByUserIdAndJobId(UUID userId, int jobId);
}
