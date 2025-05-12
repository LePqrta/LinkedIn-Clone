package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.EducationRequest;
import com.mrvalevictorian.backend.model.Education;
import com.mrvalevictorian.backend.service.EducationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/education")
@RequiredArgsConstructor
public class EducationController {

    private final EducationService educationService;

    @PostMapping("/create-education")
    public ResponseEntity<String> createEducation(@RequestBody EducationRequest educationRequest) {
        educationService.createEducation(educationRequest);
        return ResponseEntity.ok("Education entry created successfully");
    }

    @DeleteMapping("/delete-education/{educationId}")
    public ResponseEntity<String> deleteEducation(@PathVariable Long educationId) {
        try {
            educationService.deleteEducation(educationId);
            return ResponseEntity.ok("Education entry deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/profile/{profileId}")
    public ResponseEntity<List<Education>> getEducationByProfile(@PathVariable Long profileId) {
        List<Education> educationList = educationService.getEducationByProfile(profileId);
        return ResponseEntity.ok(educationList);
    }
}

