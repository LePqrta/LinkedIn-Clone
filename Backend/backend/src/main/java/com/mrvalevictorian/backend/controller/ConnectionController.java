package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.ConnectionRequest;
import com.mrvalevictorian.backend.model.Connection;
import com.mrvalevictorian.backend.service.ConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/connections")
@RequiredArgsConstructor
public class ConnectionController {
    private final ConnectionService connectionService;

    @PostMapping("/send-connection")
    public ResponseEntity<Map<String, String>> sendConnectionRequest(@RequestBody ConnectionRequest connectionRequest) {
        connectionService.sendConnectionRequest(connectionRequest.username());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Connection sent successfully");
        return ResponseEntity.ok(response);
    }
    @PostMapping("/accept-connection")
    public ResponseEntity<String> acceptConnectionRequest(@RequestParam int connectionId) {
        connectionService.acceptConnectionRequest(connectionId);
        return ResponseEntity.ok("Connection accepted successfully");
    }
    @PostMapping("/reject-connection")
    public ResponseEntity<String> rejectConnectionRequest(@RequestParam int connectionId) {
        connectionService.rejectConnectionRequest(connectionId);
        return ResponseEntity.ok("Connection rejected successfully");
    }

    @GetMapping("/get-connections")
    public ResponseEntity<List<Connection>> getAcceptedConnections() {
        List<Connection> connections = connectionService.getAcceptedConnectionsByUser();
        return ResponseEntity.ok(connections);
    }
    @GetMapping("/pending-connections")
    public ResponseEntity<List<Connection>> getPendingConnections() {
        List<Connection> connections = connectionService.getPendingConnectionsForNotification();
        return ResponseEntity.ok(connections);
    }
    @GetMapping("/pending-connections-sender")
    public ResponseEntity<List<Connection>> getPendingConnectionsForSender() {
        List<Connection> connections = connectionService.getPendingConnectionsForSender();
        return ResponseEntity.ok(connections);
    }
    @DeleteMapping("/remove-connection/{connectionId}")
    public ResponseEntity<String> deleteConnection(@PathVariable int connectionId) {
        connectionService.removeConnection(connectionId);
        return ResponseEntity.ok("Connection deleted successfully");
    }
    @GetMapping("/get-my-all-connections")
    public ResponseEntity<List<Connection>> getAllConnections() {
        List<Connection> connections = connectionService.getAllConnections();
        return ResponseEntity.ok(connections);
    }
    @GetMapping("/get-connections-of-user/{username}")
    public ResponseEntity<List<Connection>> getConnectionsOfUser(@PathVariable String username) {
        List<Connection> connections = connectionService.getConnectionsByUsername(username);
        return ResponseEntity.ok(connections);
    }
}
