package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.JobCreateRequest;
import com.mrvalevictorian.backend.model.Job;
import com.mrvalevictorian.backend.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/jobs")
public class JobController {
    private final JobService jobService;

    @PostMapping("/create-job")
    public ResponseEntity<String> createJob(@RequestBody JobCreateRequest jobCreateRequest) {

        try {
            jobService.createJob(jobCreateRequest);
            return ResponseEntity.ok("Job created successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @DeleteMapping("/delete-job/{jobId}")
    public ResponseEntity<String> deleteJob(@PathVariable int jobId) {
        try {
            jobService.deleteJob(jobId);
            return ResponseEntity.ok("Job deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
    @GetMapping("/get-jobs")
    public ResponseEntity<List<Job>> getAllJobs() {
        try {
            List<Job> jobs = jobService.getAllJobs();
            return ResponseEntity.ok(jobs);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(500).body(null);
        }
    }
    @GetMapping("/get-jobs-not-applied")
    public ResponseEntity<List<Job>> getJobsNotApplied() {
        try {
            List<Job> jobs = jobService.getAllJobsNotApplied();
            return ResponseEntity.ok(jobs);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(500).body(null);
        }
    }
    @GetMapping("/get-jobs-applied")
    public  ResponseEntity<List<Job>> getJobsApplied() {
        try {
            List<Job> jobs = jobService.getAllJobsApplied();
            return ResponseEntity.ok(jobs);
        } catch (IllegalArgumentException e) {
                return ResponseEntity.status(500).body(null);
        }
    }
    @GetMapping("/get-jobs-created")
    public ResponseEntity<List<Job>> getJobsCreated() {
        try {
            List<Job> jobs = jobService.getByUserId();
            return ResponseEntity.ok(jobs);
        } catch (IllegalArgumentException _) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
