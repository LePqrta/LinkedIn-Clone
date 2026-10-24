package com.mrvalevictorian.backend.service;

import com.mrvalevictorian.backend.enums.StatusEnum;
import com.mrvalevictorian.backend.exceptions.ConnectionException;
import com.mrvalevictorian.backend.exceptions.UserNotFoundException;
import com.mrvalevictorian.backend.model.Connection;
import com.mrvalevictorian.backend.model.User;
import com.mrvalevictorian.backend.repo.ConnectionRepo;
import com.mrvalevictorian.backend.repo.UserRepo;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConnectionServiceTest {

    @Mock private UserRepo userRepo;
    @Mock private ConnectionRepo connectionRepo;
    @InjectMocks private ConnectionService connectionService;

    private final User alice = User.builder().id(UUID.randomUUID()).username("alice").build();
    private final User bob = User.builder().id(UUID.randomUUID()).username("bob").build();

    @BeforeEach
    void authenticateAlice() {
        authenticate("alice");
    }

    @AfterEach
    void clearAuthentication() {
        SecurityContextHolder.clearContext();
    }

    private void authenticate(String username) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(username, null, List.of())
        );
    }

    private void availableUsers() {
        when(userRepo.findByUsername("alice")).thenReturn(Optional.of(alice));
        when(userRepo.findByUsername("bob")).thenReturn(Optional.of(bob));
    }

    private Connection pending(User sender, User receiver) {
        return Connection.builder().connectionId(17).sender(sender).receiver(receiver)
                .status(StatusEnum.PENDING).build();
    }

    @Test
    void rejectsSelfConnectionsUsingUuidValuesNotObjectIdentity() {
        UUID identifier = alice.getId();
        User sameUser = User.builder()
                .id(new UUID(identifier.getMostSignificantBits(), identifier.getLeastSignificantBits()))
                .username("same-alice").build();
        when(userRepo.findByUsername("alice")).thenReturn(Optional.of(alice));
        when(userRepo.findByUsername("same-alice")).thenReturn(Optional.of(sameUser));

        assertThrows(ConnectionException.class,
                () -> connectionService.sendConnectionRequest("same-alice"));
        verifyNoInteractions(connectionRepo);
    }

    @Test
    void sendsPendingRequestForUsersWithoutAConnection() {
        availableUsers();

        connectionService.sendConnectionRequest("bob");

        ArgumentCaptor<Connection> saved = ArgumentCaptor.forClass(Connection.class);
        verify(connectionRepo).save(saved.capture());
        assertEquals(alice, saved.getValue().getSender());
        assertEquals(bob, saved.getValue().getReceiver());
        assertEquals(StatusEnum.PENDING, saved.getValue().getStatus());
        assertTrue(saved.getValue().getCreatedAt() != null);
        verify(connectionRepo).existsBySenderAndReceiver(alice, bob);
        verify(connectionRepo).existsBySenderAndReceiver(bob, alice);
    }

    @Test
    void rejectsDuplicateRequestInSameDirection() {
        availableUsers();
        when(connectionRepo.existsBySenderAndReceiver(alice, bob)).thenReturn(true);

        assertThrows(ConnectionException.class, () -> connectionService.sendConnectionRequest("bob"));
        verify(connectionRepo, never()).save(any(Connection.class));
    }

    @Test
    void rejectsDuplicateRequestInOppositeDirection() {
        availableUsers();
        when(connectionRepo.existsBySenderAndReceiver(bob, alice)).thenReturn(true);

        assertThrows(ConnectionException.class, () -> connectionService.sendConnectionRequest("bob"));
        verify(connectionRepo, never()).save(any(Connection.class));
    }

    @Test
    void requestReceiverCanAcceptPendingRequest() {
        Connection connection = pending(bob, alice);
        when(connectionRepo.findById(17)).thenReturn(Optional.of(connection));

        connectionService.acceptConnectionRequest(17);

        assertEquals(StatusEnum.ACCEPTED, connection.getStatus());
        verify(connectionRepo).save(connection);
    }

    @Test
    void requestSenderCannotAcceptOwnRequest() {
        Connection connection = pending(alice, bob);
        when(connectionRepo.findById(17)).thenReturn(Optional.of(connection));

        assertThrows(UserNotFoundException.class,
                () -> connectionService.acceptConnectionRequest(17));
        verify(connectionRepo, never()).save(any(Connection.class));
    }

    @Test
    void acceptedRequestCannotBeAcceptedAgain() {
        Connection connection = pending(bob, alice);
        connection.setStatus(StatusEnum.ACCEPTED);
        when(connectionRepo.findById(17)).thenReturn(Optional.of(connection));

        assertThrows(ConnectionException.class,
                () -> connectionService.acceptConnectionRequest(17));
        verify(connectionRepo, never()).save(any(Connection.class));
    }

    @Test
    void requestReceiverCanRejectPendingRequest() {
        Connection connection = pending(bob, alice);
        when(connectionRepo.findById(17)).thenReturn(Optional.of(connection));

        connectionService.rejectConnectionRequest(17);

        assertEquals(StatusEnum.REJECTED, connection.getStatus());
        verify(connectionRepo).save(connection);
    }

    @Test
    void acceptedRequestCannotBeRejected() {
        Connection connection = pending(bob, alice);
        connection.setStatus(StatusEnum.ACCEPTED);
        when(connectionRepo.findById(17)).thenReturn(Optional.of(connection));

        assertThrows(ConnectionException.class,
                () -> connectionService.rejectConnectionRequest(17));
        verify(connectionRepo, never()).save(any(Connection.class));
    }

    @Test
    void unrelatedUserCannotRemoveConnection() {
        Connection connection = pending(bob, User.builder()
                .id(UUID.randomUUID()).username("charlie").build());
        when(connectionRepo.findById(17)).thenReturn(Optional.of(connection));

        assertThrows(UserNotFoundException.class,
                () -> connectionService.removeConnection(17));
        verify(connectionRepo, never()).delete(any(Connection.class));
    }

    @Test
    void participantCanRemoveConnection() {
        Connection connection = pending(alice, bob);
        when(connectionRepo.findById(17)).thenReturn(Optional.of(connection));

        connectionService.removeConnection(17);

        verify(connectionRepo).delete(connection);
    }

    @Test
    void pendingRequestsAreRetrievedForAuthenticatedUser() {
        List<Connection> pending = List.of(pending(bob, alice));
        when(connectionRepo.findPendingConnectionsForNotification("alice")).thenReturn(pending);

        assertEquals(pending, connectionService.getPendingConnectionsForNotification());
    }

    @Test
    void unauthenticatedRequestCannotSendConnection() {
        SecurityContextHolder.clearContext();

        assertThrows(UserNotFoundException.class,
                () -> connectionService.sendConnectionRequest("bob"));
        verifyNoInteractions(userRepo, connectionRepo);
    }
}
