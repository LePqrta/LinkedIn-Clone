package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.ConnectionRequest;
import com.mrvalevictorian.backend.exceptions.ConnectionException;
import com.mrvalevictorian.backend.exceptions.UserNotFoundException;
import com.mrvalevictorian.backend.service.ConnectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/connections")
public class ConnectionController {
    private final ConnectionService connectionService;

    public ConnectionController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

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
}

