package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.JobCreateRequest;
import com.mrvalevictorian.backend.dto.response.JobResponse;
import com.mrvalevictorian.backend.mapper.AppMapper;
import com.mrvalevictorian.backend.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.resource.ResourceUrlProvider;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/jobs")
public class JobController {
    private final JobService jobService;
    private final AppMapper mapper;
    private final ResourceUrlProvider resourceUrlProvider;

    @PostMapping("/create-job")
    public ResponseEntity<String> createJob(@RequestBody @Valid JobCreateRequest jobCreateRequest) {
        jobService.createJob(jobCreateRequest);
        return ResponseEntity.ok("Job created successfully");
    }

    @DeleteMapping("/delete-job/{jobId}")
    public ResponseEntity<String> deleteJob(@PathVariable int jobId) {
        jobService.deleteJob(jobId);
        return ResponseEntity.ok("Job deleted successfully");
    }
    @GetMapping("/get-jobs")
    public ResponseEntity<List<JobResponse>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs().stream().map(mapper::toJobResponse).toList());
    }
    @GetMapping("/get-jobs-not-applied")
    public ResponseEntity<List<JobResponse>> getJobsNotApplied() {
        return ResponseEntity.ok(jobService.getAllJobsNotApplied().stream().map(mapper::toJobResponse).toList());
    }
    @GetMapping("/get-jobs-applied")
    public  ResponseEntity<List<JobResponse>> getJobsApplied() {
        return ResponseEntity.ok(jobService.getAllJobsApplied().stream().map(mapper::toJobResponse).toList());
    }
    @GetMapping("/get-jobs-created")
    public ResponseEntity<List<JobResponse>> getJobsCreated() {
        return ResponseEntity.ok(jobService.getByUserId().stream().map(mapper::toJobResponse).toList());
    }
}
