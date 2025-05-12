package com.mrvalevictorian.backend.controller;


import com.mrvalevictorian.backend.dto.ProfileEditRequest;
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
    @PostMapping("/edit-profile")
    public ResponseEntity<String> editProfile(@RequestBody ProfileEditRequest profileEditRequest) {
        try {
            profileService.editProfile(profileEditRequest);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating profile: " + e.getMessage());
        }
    }
}
