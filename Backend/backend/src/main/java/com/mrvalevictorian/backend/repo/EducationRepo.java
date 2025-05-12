package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EducationRepo extends JpaRepository<Education, Long> {

    @Query("SELECT e FROM Education e WHERE e.profile.profileId = ?1")
    List<Education> findByProfileId(Long profileId);
    // Bir profile ait tüm eğitim kayıtlarını getiriyor.
}
