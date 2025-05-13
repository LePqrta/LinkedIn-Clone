package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.SkillRequest;
import com.mrvalevictorian.backend.model.Skills;
import com.mrvalevictorian.backend.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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


    @PostMapping("/create-skill")
    public ResponseEntity<Map<String, String>> createSkill(@RequestBody SkillRequest skillRequest) {
        skillService.createSkill(skillRequest);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Skill created successfully");

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete-skill/{skillId}")
    public ResponseEntity<String> deleteSkill(@PathVariable Long skillId) {
        try {
            skillService.deleteSkill(skillId);
            return ResponseEntity.ok("Skill deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        }
    }


    @GetMapping("/profile/{profileId}")
    public ResponseEntity<List<Skills>> getSkillsByProfile(@PathVariable Long profileId) {
        List<Skills> skills = skillService.getSkillsByProfile(profileId);
        return ResponseEntity.ok(skills);
    }
}
