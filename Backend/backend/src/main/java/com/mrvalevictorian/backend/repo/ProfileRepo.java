package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepo extends JpaRepository<Profile, Long> {
}
