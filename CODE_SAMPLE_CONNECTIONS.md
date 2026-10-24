# Code sample: Connection management

This guide points reviewers to a focused feature in the LinkedIn-inspired full-stack application rather than asking them to review the entire repository.

## Problem and functionality

Users can send connection requests, accept or reject incoming requests, remove connections, and view accepted or pending relationships. The accepted relationship graph also determines which users' posts appear in the personalized feed.

## Start with these files

**Backend**
- [ConnectionService.java](Backend/backend/src/main/java/com/mrvalevictorian/backend/service/ConnectionService.java) — business rules, authenticated user identity, relationship state transitions
- [ConnectionController.java](Backend/backend/src/main/java/com/mrvalevictorian/backend/controller/ConnectionController.java) — HTTP endpoints
- [ConnectionRepo.java](Backend/backend/src/main/java/com/mrvalevictorian/backend/repo/ConnectionRepo.java) — Spring Data JPA queries for accepted/pending connections
- [Connection.java](Backend/backend/src/main/java/com/mrvalevictorian/backend/model/Connection.java) — sender, receiver and status entity
- [PostRepo.java](Backend/backend/src/main/java/com/mrvalevictorian/backend/repo/PostRepo.java) — customized feed based on accepted connections
- [ConnectionServiceTest.java](Backend/backend/src/test/java/com/mrvalevictorian/backend/service/ConnectionServiceTest.java) — focused unit regression tests added after the original implementation

**Frontend**
- [Connections.tsx](Frontend/frontend/src/features/connections/pages/Connections.tsx) — browse users and send/cancel requests
- [Notifications.tsx](Frontend/frontend/src/features/connections/pages/Notifications.tsx) — accept/reject incoming requests

## Technology

Java, Spring Boot, Spring Security, Spring Data JPA, PostgreSQL, React and TypeScript.

## Design decisions worth discussing

- Connection is modeled as a directed request with a status (`PENDING`, `ACCEPTED`, `REJECTED`) but an accepted connection is treated as undirected when querying the relationship graph.
- Only the intended recipient can accept or reject an incoming request; participants may remove the connection.
- The service obtains the current principal from the request's Spring Security context rather than sharing a mutable singleton JWT value.
- Duplicate checks look in both directions for an existing relationship.
- Accepted connections can be used to filter a personalized post feed through a JPQL query.

## Limitations / further work

- The current pair of application-level existence checks blocks sequential duplicates but is **not atomic** under truly concurrent opposite-direction requests. Production-hardening would require database-backed serialization/locking or another robust uniqueness strategy.
- Rejected requests are currently stored and still block new requests for the same pair. Allowing re-requests should be an explicit product rule with suitable tests.
- Other features still use the older JWT service pattern and should be reviewed separately.

## Local focused verification

With JDK 23 and the backend Maven wrapper (from `Backend/backend`):

```bash
./mvnw -Dtest=ConnectionServiceTest test
```

With Node.js and dependencies installed (from `Frontend/frontend`):

```bash
npm run build
npm run lint
```

These commands are guidance for local verification, not a claim that they have been executed.
