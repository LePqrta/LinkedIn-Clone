package com.mrvalevictorian.backend.controller;


import com.mrvalevictorian.backend.dto.LocationEditRequest;
import com.mrvalevictorian.backend.dto.SummaryEditRequest;
import com.mrvalevictorian.backend.model.Profile;
import com.mrvalevictorian.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/profile")
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping("/my-profile")
    public ResponseEntity<Profile> getMyProfile() {
        Profile profile = profileService.getProfile();
        return ResponseEntity.ok(profile);
    }
    @GetMapping("/get-profile/{username}")
    public ResponseEntity<Profile> getProfileByUsername(@PathVariable String username) {
        Profile profile = profileService.getProfileByUsername(username);
        return ResponseEntity.ok(profile);
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
