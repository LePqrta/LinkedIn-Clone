package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface JobRepo extends JpaRepository<Job, Integer> {
    Optional<Object> findByTitle(String title);

    @Query("SELECT j FROM Job j WHERE j.jobId NOT IN (SELECT a.job.jobId FROM Application a WHERE a.user.id = :userId)")
    List<Job> findJobsNotAppliedByUser(@Param("userId") Integer userId);
}


