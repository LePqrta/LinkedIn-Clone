package com.mrvalevictorian.backend.service;

import com.mrvalevictorian.backend.dto.JobCreateRequest;
import com.mrvalevictorian.backend.exceptions.UserNotFoundException;
import com.mrvalevictorian.backend.model.Job;
import com.mrvalevictorian.backend.model.User;
import com.mrvalevictorian.backend.repo.JobRepo;
import com.mrvalevictorian.backend.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {
    private final JobRepo jobRepo;
    private final JwtService jwtService;
    private final UserRepo userRepo;

    public void createJob(JobCreateRequest jobCreateRequest) {
        if(jobCreateRequest.getTitle().isEmpty() || jobCreateRequest.getDescription().isEmpty()
                || jobCreateRequest.getLocation().isEmpty() ||
                jobCreateRequest.getCompanyName().isEmpty()) {
            throw new IllegalArgumentException("Missing information either in " +
                    "title or description or location or company name");
        }
        if(jobRepo.findByTitle(jobCreateRequest.getTitle()).isPresent()) {
            throw new IllegalArgumentException("Job with this title already exists");
        }
        String username = jwtService.extractUser(jwtService.getToken());
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        Job job = new Job();
        job.setUser(user);
        job.setTitle(jobCreateRequest.getTitle());
        job.setDescription(jobCreateRequest.getDescription());
        job.setCompanyName(jobCreateRequest.getCompanyName());
        job.setLocation(jobCreateRequest.getLocation());
        job.setPostedAt(LocalDateTime.now());
        jobRepo.save(job);
    }
    public void deleteJob(int jobId) {
        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        String username = jwtService.extractUser(jwtService.getToken());
        if(!job.getUser().getUsername().equals(username)) {
            throw new AuthorizationDeniedException("You are not authorized to delete this job");
        }
        jobRepo.delete(job);
    }
    public List<Job> getAllJobs(){
        return jobRepo.findAll();
    }

    public List<Job> getAllJobsNotApplied() {
        String username = jwtService.extractUser(jwtService.getToken());
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Authentication error"));
        return jobRepo.findJobsNotApplied(user.getId());
    }
    public List<Job> getAllJobsApplied() {
        String username = jwtService.extractUser(jwtService.getToken());
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Authentication error"));
        return jobRepo.findJobsApplied(user.getId());
    }
}
