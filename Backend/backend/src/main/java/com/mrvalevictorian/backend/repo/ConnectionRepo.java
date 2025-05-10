package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Connection;
import org.springframework.data.jpa.repository.JpaRepository;




public interface ConnectionRepo extends JpaRepository<Connection, Integer> {
}