package com.mrvalevictorian.backend.service;

import com.mrvalevictorian.backend.dto.EducationRequest;
import com.mrvalevictorian.backend.model.Education;
import com.mrvalevictorian.backend.model.Profile;
import com.mrvalevictorian.backend.repo.EducationRepo;
import com.mrvalevictorian.backend.repo.ProfileRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EducationService {

    private final EducationRepo educationRepo;
    private final ProfileRepo profileRepo;

    public void createEducation(EducationRequest educationRequest) {
        Profile profile = profileRepo.findById(educationRequest.getProfileId())
                .orElseThrow(() -> new RuntimeException("Profile not found with ID: " + educationRequest.getProfileId()));

        Education education = new Education();
        education.setDegree(educationRequest.getDegree());
        education.setInstitutionName(educationRequest.getInstitutionName());
        education.setFieldOfStudy(educationRequest.getFieldOfStudy());
        education.setStartDate(educationRequest.getStartDate());
        education.setEndDate(educationRequest.getEndDate());
        education.setProfile(profile);

        educationRepo.save(education);
    }

    public void deleteEducation(Long educationId) {
        Education education = educationRepo.findById(educationId)
                .orElseThrow(() -> new RuntimeException("Education not found with ID: " + educationId));

        educationRepo.delete(education);
    }

    public List<Education> getEducationByProfile(Long profileId) {
        if (!profileRepo.existsById(profileId)) {
            throw new RuntimeException("Profile not found with ID: " + profileId);
        }
        return educationRepo.findByProfileId(profileId);
    }
}

