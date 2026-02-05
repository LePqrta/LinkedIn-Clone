package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.SkillRequest;
import com.mrvalevictorian.backend.dto.response.SkillResponse;
import com.mrvalevictorian.backend.mapper.EntityMapper;
import com.mrvalevictorian.backend.service.SkillService;
import jakarta.persistence.EntityManager;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;
    private final EntityMapper mapper;


    @PostMapping("/create-skill")
    public ResponseEntity<Map<String, String>> createSkill(@RequestBody @Valid SkillRequest skillRequest) {
        skillService.createSkill(skillRequest);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Skill created successfully");

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete-skill/{skillId}")
    public ResponseEntity<String> deleteSkill(@PathVariable Long skillId) {
        skillService.deleteSkill(skillId);
        return ResponseEntity.ok("Skill deleted successfully");
    }


    @GetMapping("/profile/{profileId}")
    public ResponseEntity<List<SkillResponse>> getSkillsByProfile(@PathVariable Long profileId) {
        return ResponseEntity.ok(skillService.getSkillsByProfile(profileId)
                .stream().map(mapper::toSkillResponse)
                .toList());
    }
}
