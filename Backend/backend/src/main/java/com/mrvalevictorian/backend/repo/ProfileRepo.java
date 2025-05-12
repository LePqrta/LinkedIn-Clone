package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;


public interface ProfileRepo extends JpaRepository<Profile, Long> {
    @Query("SELECT p FROM Profile p JOIN p.user u WHERE u.username = :username")
    Optional<Profile> findProfileByUsername(@Param("username") String username);
}
