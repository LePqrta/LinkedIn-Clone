package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Connection;
import com.mrvalevictorian.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ConnectionRepo extends JpaRepository<Connection, Integer> {

    @Query("SELECT c FROM Connection c WHERE c.sender.id= :senderId OR c.receiver.id=:senderId AND c.status = 'ACCEPTED'")
    List<Connection> findAcceptedConnections(UUID senderId);

    @Query("SELECT c FROM Connection c WHERE c.receiver.username = :username AND c.status = 'PENDING'")
    List<Connection> findPendingConnections(String username);

    boolean existsBySenderAndReceiver(User sender, User receiver);
}