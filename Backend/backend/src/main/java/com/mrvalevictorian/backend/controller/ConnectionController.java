package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.ConnectionRequest;
import com.mrvalevictorian.backend.dto.response.ConnectionResponse;
import com.mrvalevictorian.backend.mapper.EntityMapper;
import com.mrvalevictorian.backend.service.ConnectionService;
import jakarta.validation.Valid;
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
    private final EntityMapper mapper;

    @PostMapping("/send-connection")
    public ResponseEntity<Map<String, String>> sendConnectionRequest(@RequestBody @Valid ConnectionRequest connectionRequest) {
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
    public ResponseEntity<List<ConnectionResponse>> getAcceptedConnections() {
        return ResponseEntity.ok(connectionService.getAcceptedConnectionsByUser()
                .stream().map(mapper::toConnectionResponse).toList());
    }
    @GetMapping("/pending-connections")
    public ResponseEntity<List<ConnectionResponse>> getPendingConnections() {
        return ResponseEntity.ok(connectionService.getPendingConnectionsForNotification()
                .stream().map(mapper::toConnectionResponse).toList());
    }
    @GetMapping("/pending-connections-sender")
    public ResponseEntity<List<ConnectionResponse>> getPendingConnectionsForSender() {
        return ResponseEntity.ok(connectionService.getPendingConnectionsForSender()
                .stream().map(mapper::toConnectionResponse).toList());
    }
    @DeleteMapping("/remove-connection/{connectionId}")
    public ResponseEntity<String> deleteConnection(@PathVariable int connectionId) {
        connectionService.removeConnection(connectionId);
        return ResponseEntity.ok("Connection deleted successfully");
    }
    @GetMapping("/get-my-all-connections")
    public ResponseEntity<List<ConnectionResponse>> getAllConnections() {
        return  ResponseEntity.ok(connectionService.getAllConnections()
                .stream().map(mapper::toConnectionResponse).toList());
    }
    @GetMapping("/get-connections-of-user/{username}")
    public ResponseEntity<List<ConnectionResponse>> getConnectionsOfUser(@PathVariable String username) {
        return ResponseEntity.ok(connectionService.getConnectionsByUsername(username)
                .stream().map(mapper::toConnectionResponse).toList());
    }
}
