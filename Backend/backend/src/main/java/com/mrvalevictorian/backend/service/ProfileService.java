package com.mrvalevictorian.backend.service;

import com.mrvalevictorian.backend.dto.ProfileEditRequest;
import com.mrvalevictorian.backend.model.Profile;
import com.mrvalevictorian.backend.repo.ProfileRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepo profileRepo;
    private final JwtService jwtService;

    public Profile getProfile() {
        String username = jwtService.extractUser(jwtService.getToken());
        return profileRepo.findProfileByUsername(username)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }
    public void editProfile(ProfileEditRequest profileEditRequest) {
        String username = jwtService.extractUser(jwtService.getToken());
        Profile profile = profileRepo.findProfileByUsername(username)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        profile.setLocation(profileEditRequest.getLocation());
        profile.setSummary(profileEditRequest.getSummary());
        profileRepo.save(profile);
    }
    public Profile getProfileByUsername(String username) {
        return profileRepo.findProfileByUsername(username)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }
}
