package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.id <> :myId AND u.role <> 'ADMIN' AND u.id NOT IN (" +
    "SELECT CASE WHEN c.sender.id = :myId THEN c.receiver.id ELSE c.sender.id END " +
    "FROM Connection c WHERE (c.sender.id = :myId OR c.receiver.id = :myId) AND (c.status = 'ACCEPTED' OR c.status = 'PENDING'))")
    List<User> findAllUsersWithoutConnection(@Param("myId") UUID myId);
    Optional<User> findById(UUID id);
}