package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.EducationRequest;
import com.mrvalevictorian.backend.dto.response.EducationResponse;
import com.mrvalevictorian.backend.mapper.AppMapper;
import com.mrvalevictorian.backend.service.EducationService;
import jakarta.validation.Valid;
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
    private final AppMapper mapper;

    @PostMapping("/create-education")
    public ResponseEntity<Map<String, String>> createEducation(@RequestBody @Valid EducationRequest educationRequest) {
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
    public ResponseEntity<List<EducationResponse>> getEducationByProfile(@PathVariable Long profileId) {
        return ResponseEntity.ok(
                educationService.getEducationByProfile(profileId).stream()
                        .map(mapper::toEducationResponse)
                        .toList()
        );
    }
}
