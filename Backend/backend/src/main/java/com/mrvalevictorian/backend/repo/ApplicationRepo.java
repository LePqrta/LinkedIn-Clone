package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ApplicationRepo extends JpaRepository<Application, Integer> {
    @Query("SELECT a FROM Application a WHERE a.user.id = :userId AND a.job.jobId = :jobId")
    Optional<Application> findByUserIdAndJobId(UUID userId, int jobId);

    @Query("SELECT a FROM Application a WHERE a.job.user.id = :ownerId AND a.job.jobId = :jobId")
    List<Application> findAllApplicationsForUserJobListing(UUID ownerId, int jobId);
}
