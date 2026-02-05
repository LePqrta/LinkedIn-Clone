package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.ExperienceRequest;
import com.mrvalevictorian.backend.dto.response.ExperienceResponse;
import com.mrvalevictorian.backend.mapper.EntityMapper;
import com.mrvalevictorian.backend.model.Experience;
import com.mrvalevictorian.backend.service.ExperienceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/experiences")
@RequiredArgsConstructor
public class ExperienceController {

    private final ExperienceService experienceService;
    private final EntityMapper mapper;

    @PostMapping("/create-experience")
    public ResponseEntity<Map<String, String>> createExperience(@RequestBody @Valid ExperienceRequest experienceRequest) {
        experienceService.createExperience(experienceRequest);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Experience created successfully");

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete-experience/{experienceId}")
    public ResponseEntity<String> deleteExperience(@PathVariable Integer experienceId) {
        experienceService.deleteExperience(experienceId);
        return ResponseEntity.ok("Experience deleted successfully");
    }

    @GetMapping("/profile/{profileId}")
    public ResponseEntity<List<ExperienceResponse>> getExperiencesByProfile(@PathVariable Long profileId) {
        return ResponseEntity.ok(
                experienceService.getExperiencesByProfile(profileId)
                        .stream()
                        .map(mapper::toExperienceResponse)
                        .toList()
        );
    }
}
