package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Connection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ConnectionRepo extends JpaRepository<Connection, Integer> {

    @Query("SELECT c FROM Connection c WHERE c.sender.username= :username AND c.status = 'ACCEPTED'")
    List<Connection> findAcceptedConnections(String username);

    @Query("SELECT c FROM Connection c WHERE c.sender.username = :username AND c.status = 'PENDING'")
    List<Connection> findPendingConnections(String username);
}