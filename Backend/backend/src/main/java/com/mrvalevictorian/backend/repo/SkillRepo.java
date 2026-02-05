package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SkillRepo extends JpaRepository<Skill, Long> {
    @Query("SELECT s FROM Skill s WHERE s.profile.profileId = ?1")
    List<Skill> findByProfileId(Long profileId);
}
