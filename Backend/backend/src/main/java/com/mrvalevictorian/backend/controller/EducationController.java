package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.EducationRequest;
import com.mrvalevictorian.backend.model.Education;
import com.mrvalevictorian.backend.service.EducationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/education")
@RequiredArgsConstructor
public class EducationController {

    private final EducationService educationService;

    @PostMapping("/create-education")
    public ResponseEntity<Map<String, String>> createEducation(@RequestBody EducationRequest educationRequest) {
        educationService.createEducation(educationRequest);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Education entry created successfully");

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete-education/{educationId}")
    public ResponseEntity<String> deleteEducation(@PathVariable Long educationId) {
        educationService.deleteEducation(educationId);
        return ResponseEntity.ok("Education entry deleted successfully");
    }

    @GetMapping("/profile/{profileId}")
    public ResponseEntity<List<Education>> getEducationByProfile(@PathVariable Long profileId) {
        List<Education> educationList = educationService.getEducationByProfile(profileId);
        return ResponseEntity.ok(educationList);
    }
}
