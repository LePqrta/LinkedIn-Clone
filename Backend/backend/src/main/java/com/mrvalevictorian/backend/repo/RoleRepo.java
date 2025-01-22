package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.enums.RoleEnum;
import com.mrvalevictorian.backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;


public interface RoleRepo extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleEnum name);
    Optional<Role> findById(UUID id);

}
