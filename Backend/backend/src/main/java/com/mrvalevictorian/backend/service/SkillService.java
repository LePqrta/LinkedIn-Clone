package com.mrvalevictorian.backend.service;

import com.mrvalevictorian.backend.dto.SkillRequest;
import com.mrvalevictorian.backend.model.Profile;
import com.mrvalevictorian.backend.model.Skill;
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
        Profile profile = profileRepo.findById(skillRequest.profileId())
                .orElseThrow(() -> new RuntimeException("Profile not found with ID: " + skillRequest.profileId()));


        var newSkill = Skill.builder()
                .skillName(skillRequest.skillName())
                .profile(profile)
                .build();

        skillRepo.save(newSkill);
    }

    public void deleteSkill(Long skillId) {
        Skill skill = skillRepo.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found with ID: " + skillId));

        skillRepo.delete(skill);
    }




    public List<Skill> getSkillsByProfile(Long profileId) {
        if (!profileRepo.existsById(profileId)) {
            throw new RuntimeException("Profile not found with ID: " + profileId);
        }
        return skillRepo.findByProfileId(profileId);
    }
}

