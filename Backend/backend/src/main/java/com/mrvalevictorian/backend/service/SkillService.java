package com.mrvalevictorian.backend.service;

import com.mrvalevictorian.backend.dto.SkillRequest;
import com.mrvalevictorian.backend.model.Profile;
import com.mrvalevictorian.backend.model.Skills;
import com.mrvalevictorian.backend.repo.ProfileRepo;
import com.mrvalevictorian.backend.repo.SkillRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepo skillRepo;
    private final ProfileRepo profileRepo;


    public void createSkill(SkillRequest skillRequest) {
        Profile profile = profileRepo.findById(skillRequest.getProfileId())
                .orElseThrow(() -> new RuntimeException("Profile not found with ID: " + skillRequest.getProfileId()));

        Skills skill = new Skills();
        skill.setSkillName(skillRequest.getSkillName());
        skill.setProfile(profile);

        skillRepo.save(skill);
    }

    public List<Skills> getSkillsByProfile(Long profileId) {
        if (!profileRepo.existsById(profileId)) {
            throw new RuntimeException("Profile not found with ID: " + profileId);
        }
        return skillRepo.findByProfileId(profileId);
    }
}

