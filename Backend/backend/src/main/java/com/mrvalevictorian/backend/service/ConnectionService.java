package com.mrvalevictorian.backend.service;

import com.mrvalevictorian.backend.enums.StatusEnum;
import com.mrvalevictorian.backend.exceptions.ConnectionException;
import com.mrvalevictorian.backend.exceptions.UserNotFoundException;
import com.mrvalevictorian.backend.model.Connection;
import com.mrvalevictorian.backend.model.User;
import com.mrvalevictorian.backend.repo.ConnectionRepo;
import com.mrvalevictorian.backend.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ConnectionService {
    private final UserRepo userRepo;
    private final ConnectionRepo connectionRepo;

    public void sendConnectionRequest(String username) {
        String senderUsername = currentUsername();
        User sender = userRepo.findByUsername(senderUsername)
                .orElseThrow(() -> new UserNotFoundException("Authentication failed"));
        User receiver = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Receiver not found"));
        if (sender.getId().equals(receiver.getId())) {
            throw new ConnectionException("You cannot send a connection request to yourself");
        }
        if (connectionRepo.existsBySenderAndReceiver(sender, receiver)
                || connectionRepo.existsBySenderAndReceiver(receiver, sender)) {
            throw new ConnectionException("Connection request already sent");
        }

        var newConnection = Connection.builder()
                .sender(sender)
                .receiver(receiver)
                .status(StatusEnum.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
        connectionRepo.save(newConnection);
    }
    public void acceptConnectionRequest(int connectionId) {
        Connection connection = connectionRepo.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));
        if(!currentUsername().equals(connection.getReceiver().getUsername())){
            throw new UserNotFoundException("Authentication failed");
        }
        if(connection.getStatus().equals(StatusEnum.ACCEPTED)){
            throw new ConnectionException("Connection already accepted");
        }
        if(connection.getStatus().equals(StatusEnum.REJECTED)){
            throw new ConnectionException("Connection error");
        }
        connection.setStatus(StatusEnum.ACCEPTED);
        connectionRepo.save(connection);
    }
    public void rejectConnectionRequest(int connectionId) {
        Connection connection = connectionRepo.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));
        if(!currentUsername().equals(connection.getReceiver().getUsername())){
            throw new UserNotFoundException("Authentication failed");
        }
        if(connection.getStatus().equals(StatusEnum.REJECTED)){
            throw new ConnectionException("Connection already rejected");
        }
        if(connection.getStatus().equals(StatusEnum.ACCEPTED)){
            throw new ConnectionException("Connection error");
        }
        connection.setStatus(StatusEnum.REJECTED);
        connectionRepo.save(connection);
    }

    public void removeConnection(int connectionId) {
        Connection connection = connectionRepo.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));
        if(!currentUsername().equals(connection.getSender().getUsername())
                &&
                !currentUsername().equals(connection.getReceiver().getUsername())){
            throw new UserNotFoundException("Authentication failed");
        }
        if(connection.getStatus().equals(StatusEnum.REMOVED)){
            throw new ConnectionException("Connection already removed");
        }
        connectionRepo.delete(connection);
    }
    public List<Connection> getAllConnections() {
        String username = currentUsername();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Authentication failed"));
        return connectionRepo.findAllConnections(user.getId());
    }
    public List<Connection> getAcceptedConnectionsByUser() {
        String username = currentUsername();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Authentication failed"));
        return connectionRepo.findAcceptedConnections(user.getId());
    }
    public List<Connection> getPendingConnectionsForNotification() {
        String username = currentUsername();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Authentication failed"));
        return connectionRepo.findPendingConnectionsForNotification(user.getUsername());
    }
    public List<Connection> getPendingConnectionsForSender() {
        String username = currentUsername();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Authentication failed"));
        return connectionRepo.findPendingConnectionsForSender(user.getUsername());
    }
    public Connection getConnectionById(int connectionId) {
        return connectionRepo.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));
    }
    public List<Connection> getConnectionsByUsername(String username) {
        return connectionRepo.findConnectionsByUsername(username);
    }
    private String currentUsername() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new UserNotFoundException("Authentication failed");
        }
        return authentication.getName();
    }
}
