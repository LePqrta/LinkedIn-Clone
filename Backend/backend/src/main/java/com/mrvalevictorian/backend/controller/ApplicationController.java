package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.ApplicationRequest;
import com.mrvalevictorian.backend.service.ApplicationService;
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
    public ResponseEntity<String> applyJob(@RequestBody ApplicationRequest applicationRequest,
                                           @PathVariable int jobId)  {
        try{
            applicationService.applyJob(applicationRequest, jobId);
            return new ResponseEntity<>("Application applied successfully", HttpStatus.OK);
        }catch (IllegalArgumentException | AuthenticationException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/get-applications/{jobId}")
    public ResponseEntity<?> getApplications(@PathVariable int jobId) {
        try {
            return new ResponseEntity<>(applicationService.getApplications(jobId), HttpStatus.OK);
        } catch (IllegalArgumentException | AuthenticationException e) {
    return ResponseEntity.status(500).body(e.getMessage());
        }
    }
    @DeleteMapping("/delete-application/{applicationId}")
    public ResponseEntity<String> deleteApplication(@PathVariable int applicationId) {
        try {
            applicationService.deleteApplication(applicationId);
            return new ResponseEntity<>("Application deleted successfully", HttpStatus.OK);
        } catch (IllegalArgumentException | AuthenticationException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
