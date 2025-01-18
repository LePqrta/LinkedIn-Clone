package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Long> {

}
