package com.mrvalevictorian.backend.service;

import com.mrvalevictorian.backend.dto.ApplicationRequest;
import com.mrvalevictorian.backend.model.Application;
import com.mrvalevictorian.backend.repo.ApplicationRepo;
import com.mrvalevictorian.backend.repo.JobRepo;
import com.mrvalevictorian.backend.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.naming.AuthenticationException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final UserRepo userRepo;
    private final JobRepo jobRepo;
    private final ApplicationRepo applicationRepo;
    private final JwtService jwtService;

    public void applyJob(ApplicationRequest applicationRequest, int jobId) throws AuthenticationException {
        if (jobRepo.findById(jobId).isEmpty()) {
            throw new IllegalArgumentException("Job not found");
        }
//        if (applicationRequest.getResumeUrl().isEmpty()){
//            throw new IllegalArgumentException("Resume URL is empty");
//        }
        String username = jwtService.extractUser(jwtService.getToken());
        if (userRepo.findByUsername(username).isEmpty()) {
            throw new AuthenticationException("Authentication failed");
        }
        if (applicationRepo.findByUserIdAndJobId(userRepo.findByUsername(username).get().getId(),
                jobId).isPresent()) {
            throw new IllegalArgumentException("You have already applied for this job");
        }
        Application application = new Application();
        application.setUser(userRepo.findByUsername(username).get());
        application.setAppliedAt(LocalDateTime.now());
        application.setCoverLetter(applicationRequest.getCoverLetter());
        //application.setResumeUrl(applicationRequest.getResumeUrl());
        application.setJob(jobRepo.findById(jobId).get());
        applicationRepo.save(application);
    }

    public List<Application> getApplications(int jobId) throws AuthenticationException {
        String username = jwtService.extractUser(jwtService.getToken());
        if (userRepo.findByUsername(username).isEmpty()) {
            throw new AuthenticationException("Authentication failed");
        }
        if (jobRepo.findById(jobId).isEmpty()) {
            throw new IllegalArgumentException("Job not found");
        }
        else if(userRepo.findByUsername(username).get().getId() != jobRepo.findById(jobId).get().getUser().getId()){
            throw new AuthenticationException("Authorization error");
        }
        return applicationRepo.findAllApplicationsForUserJobListing(userRepo.findByUsername(username).get().getId(), jobId);
    }
    public void deleteApplication(int applicationId) throws AuthenticationException {
        String username = jwtService.extractUser(jwtService.getToken());
        if (userRepo.findByUsername(username).isEmpty()) {
            throw new AuthenticationException("Authentication failed");
        }
        Application application = applicationRepo.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));
        if (application.getUser().getId() != userRepo.findByUsername(username).get().getId()) {
            throw new AuthenticationException("Authorization error");
        }
        applicationRepo.delete(application);
    }
}

