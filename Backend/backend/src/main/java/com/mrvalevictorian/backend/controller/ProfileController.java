package com.mrvalevictorian.backend.controller;


import com.mrvalevictorian.backend.dto.LocationEditRequest;
import com.mrvalevictorian.backend.dto.SummaryEditRequest;
import com.mrvalevictorian.backend.dto.response.ProfileResponse;
import com.mrvalevictorian.backend.mapper.EntityMapper;
import com.mrvalevictorian.backend.model.Profile;
import com.mrvalevictorian.backend.service.ProfileService;
import jakarta.persistence.EntityManager;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/profile")
public class ProfileController {
    private final ProfileService profileService;
    private final EntityMapper mapper;

    @GetMapping("/my-profile")
    public ResponseEntity<ProfileResponse> getMyProfile() {
        return ResponseEntity.ok(mapper.toProfileResponse(profileService.getProfile()));
    }
    @GetMapping("/get-profile/{username}")
    public ResponseEntity<ProfileResponse> getProfileByUsername(@PathVariable @Valid String username) {
        return ResponseEntity.ok(mapper.toProfileResponse(profileService.getProfileByUsername(username)));
    }
    @PutMapping("/edit-about")
    public ResponseEntity<String> editSummary(@RequestBody SummaryEditRequest summaryEditRequest) {
        profileService.editSummary(summaryEditRequest);
        return ResponseEntity.ok("About updated successfully");
    }
    @PutMapping("/edit-location")
    public ResponseEntity<String> editLocation(@RequestBody LocationEditRequest locationEditRequest) {
        profileService.editLocation(locationEditRequest);
        return ResponseEntity.ok("Location updated successfully");
    }
}
