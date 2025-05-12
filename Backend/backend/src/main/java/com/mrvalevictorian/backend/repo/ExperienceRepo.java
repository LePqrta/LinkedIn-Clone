package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ExperienceRepo extends JpaRepository<Experience, Integer> {

    @Query("SELECT e FROM Experience e WHERE e.profile.profileId = ?1")
    List<Experience> findByProfileId(Long profileId);
    // Bir profile ait tüm tecrubeleri getirir
}
