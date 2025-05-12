package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Skills;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SkillRepo extends JpaRepository<Skills, Long> {
    @Query("SELECT s FROM Skills s WHERE s.profile.profileId = ?1")
    List<Skills> findByProfileId(Long profileId); // Bir profile ait tüm yetenekleri getirir
}
