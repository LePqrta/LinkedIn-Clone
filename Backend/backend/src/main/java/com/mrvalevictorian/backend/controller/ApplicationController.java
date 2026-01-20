package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.ApplicationRequest;
import com.mrvalevictorian.backend.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.naming.AuthenticationException;


@RestController
@RequiredArgsConstructor
@RequestMapping("/application")
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<String> applyJob(@RequestBody @Valid ApplicationRequest applicationRequest,
                                           @PathVariable int jobId) throws AuthenticationException {
        applicationService.applyJob(applicationRequest, jobId);
        return new ResponseEntity<>("Application applied successfully", HttpStatus.OK);
    }
    @GetMapping("/get-applications/{jobId}")
    public ResponseEntity<?> getApplications(@PathVariable int jobId) throws AuthenticationException {
        return new ResponseEntity<>(applicationService.getApplications(jobId), HttpStatus.OK);
    }
    @DeleteMapping("/delete-application/{applicationId}")
    public ResponseEntity<String> deleteApplication(@PathVariable int applicationId) throws AuthenticationException {
        applicationService.deleteApplication(applicationId);
        return new ResponseEntity<>("Application deleted successfully", HttpStatus.OK);
    }
}
