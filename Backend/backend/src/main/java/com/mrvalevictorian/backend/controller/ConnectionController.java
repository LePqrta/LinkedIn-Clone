package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.ConnectionRequest;
import com.mrvalevictorian.backend.exceptions.ConnectionException;
import com.mrvalevictorian.backend.exceptions.UserNotFoundException;
import com.mrvalevictorian.backend.model.Connection;
import com.mrvalevictorian.backend.service.ConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/connections")
@RequiredArgsConstructor
public class ConnectionController {
    private final ConnectionService connectionService;

    @PostMapping("/send-connection")
    public ResponseEntity<String> sendConnectionRequest(@RequestBody ConnectionRequest connectionRequest) {
        try {
            connectionService.sendConnectionRequest(connectionRequest.getUsername());
            return ResponseEntity.ok("Connection sent successfully");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @PostMapping("/accept-connection")
    public ResponseEntity<String> acceptConnectionRequest(@RequestParam int connectionId) {
        try {
            connectionService.acceptConnectionRequest(connectionId);
            return ResponseEntity.ok("Connection accepted successfully");
        } catch (UserNotFoundException | ConnectionException e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
    @PostMapping("/reject-connection")
    public ResponseEntity<String> rejectConnectionRequest(@RequestParam int connectionId) {
        try {
            connectionService.rejectConnectionRequest(connectionId);
            return ResponseEntity.ok("Connection rejected successfully");
        } catch (UserNotFoundException | ConnectionException e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @GetMapping("/get-connections")
    public ResponseEntity<List<Connection>> getAcceptedConnections() {
        try {
            List<Connection> connections = connectionService.getAcceptedConnectionsByUser();
            return ResponseEntity.ok(connections);
        } catch (UserNotFoundException _) {
            return ResponseEntity.status(404).body(null);
        }
    }
    @GetMapping("/pending-connections")
    public ResponseEntity<List<Connection>> getPendingConnections() {
        try {
            List<Connection> connections = connectionService.getPendingConnectionsByUser();
            return ResponseEntity.ok(connections);
        } catch (UserNotFoundException _) {
            return ResponseEntity.status(404).body(null);
        }
    }
}

