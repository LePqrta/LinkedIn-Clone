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

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ConnectionService {
    private final UserRepo userRepo;
    private final ConnectionRepo connectionRepo;
    private final JwtService jwtService;

    public void sendConnectionRequest(String username) {
        //aynı connection atılmaması için kontrol eklenecek
        String senderUsername = jwtService.extractUser(jwtService.getToken());
        User sender = userRepo.findByUsername(senderUsername)
                .orElseThrow(() -> new UserNotFoundException("Authentication failed"));
        User receiver = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Receiver not found"));
        if (sender.getId() == receiver.getId()) {
            throw new ConnectionException("You cannot send a connection request to yourself");
        }
        if (connectionRepo.existsBySenderAndReceiver(sender, receiver)) {
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
        if(!jwtService.extractUser(jwtService.getToken()).equals(connection.getReceiver().getUsername())){
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
        if(!jwtService.extractUser(jwtService.getToken()).equals(connection.getReceiver().getUsername())){
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

    // test edilecek
    public void removeConnection(int connectionId) {
        Connection connection = connectionRepo.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));
        if(!jwtService.extractUser(jwtService.getToken()).equals(connection.getSender().getUsername())
                &&
                !jwtService.extractUser(jwtService.getToken()).equals(connection.getReceiver().getUsername())){
            throw new UserNotFoundException("Authentication failed");
        }
        if(connection.getStatus().equals(StatusEnum.REMOVED)){
            throw new ConnectionException("Connection already removed");
        }
        connectionRepo.delete(connection);
    }
    public List<Connection> getAllConnections() {
        String username = jwtService.extractUser(jwtService.getToken());
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Authentication failed"));
        return connectionRepo.findAllConnections(user.getId());
    }
    public List<Connection> getAcceptedConnectionsByUser() {
        String username = jwtService.extractUser(jwtService.getToken());
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Authentication failed"));
        return connectionRepo.findAcceptedConnections(user.getId());
    }
    public List<Connection> getPendingConnectionsForNotification() {
        String username = jwtService.extractUser(jwtService.getToken());
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Authentication failed"));
        return connectionRepo.findPendingConnectionsForNotification(user.getUsername());
    }
    public List<Connection> getPendingConnectionsForSender() {
        String username = jwtService.extractUser(jwtService.getToken());
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
}
