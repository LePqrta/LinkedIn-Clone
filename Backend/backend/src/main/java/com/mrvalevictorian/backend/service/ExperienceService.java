package com.mrvalevictorian.backend.service;

import com.mrvalevictorian.backend.dto.ExperienceRequest;
import com.mrvalevictorian.backend.model.Experience;
import com.mrvalevictorian.backend.model.Profile;
import com.mrvalevictorian.backend.repo.ExperienceRepo;
import com.mrvalevictorian.backend.repo.ProfileRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.expression.ExpressionException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExperienceService {

    private final ExperienceRepo experienceRepo;
    private final ProfileRepo profileRepo;
    private final JwtService jwtService;

    public void createExperience(ExperienceRequest experienceRequest) {
        Profile profile = profileRepo.findById(experienceRequest.getProfileId())
                .orElseThrow(() -> new ExpressionException("Profile not found with ID: " + experienceRequest.getProfileId()));

        Experience experience = new Experience();
        experience.setCompanyName(experienceRequest.getCompanyName());
        experience.setJobTitle(experienceRequest.getJobTitle());
        experience.setStartDate(experienceRequest.getStartDate());
        experience.setEndDate(experienceRequest.getEndDate());
        experience.setDescription(experienceRequest.getDescription());
        experience.setProfile(profile);

        experienceRepo.save(experience);
    }

    public void deleteExperience(Integer experienceId) {
        Experience experience = experienceRepo.findById(experienceId)
                .orElseThrow(() -> new ExpressionException("Experience not found with ID: " + experienceId));

        String username = jwtService.extractUser(jwtService.getToken());

        // Postun sahibiyle eşleşme kontrolü
        if (!experience.getProfile().getUser().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to delete this experience");
        }

        experienceRepo.delete(experience);
    }

    public List<Experience> getExperiencesByProfile(Long profileId) {
        if (!profileRepo.existsById(profileId)) {
            throw new ExpressionException("Profile not found with ID: " + profileId);
        }
        return experienceRepo.findByProfileId(profileId);
    }
}
