package com.mrvalevictorian.backend.mapper;

import com.mrvalevictorian.backend.dto.response.*;
import com.mrvalevictorian.backend.model.*;
import org.springframework.stereotype.Component;

@Component
public class EntityMapper {
    public UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .surname(user.getSurname())
                .build();
    }
    public SkillResponse toSkillResponse(Skill skill){
        if (skill == null) {return null;   }
        return SkillResponse.builder()
                .skillName(skill.getSkillName())
                .profileId(skill.getId())
                .build();
    }
    public ProfileResponse toProfileResponse(Profile profile){
        if (profile == null) {return null; }
        return ProfileResponse.builder()
                .id(profile.getProfileId())
                .user(toUserResponse(profile.getUser()))
                .location(profile.getLocation())
                .summary(profile.getSummary())
                .build();
    }
    public PostResponse toPostResponse(Post post) {
        if (post == null) {
            return null;
        }
        return
                PostResponse.builder()
                        .postId(post.getPostId())
                        .user(toUserResponse(post.getUser()))
                        .createdAt(post.getCreatedAt().toString())
                        .content(post.getContent())
                        .build();
    }
    public JobResponse toJobResponse(Job job) {
        if (job == null) {
            return null;
        }
        return JobResponse.builder()
                .jobId(job.getJobId())
                .recruiter(toUserResponse(job.getUser()))
                .companyName(job.getCompanyName())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .postedAt(job.getPostedAt())
                .build();
    }
    public ExperienceResponse toExperienceResponse(Experience experience) {
        if (experience == null) {return null; }
         return ExperienceResponse.builder()
                .experienceId(experience.getExperienceId())
                .profile(toProfileResponse(experience.getProfile()))
                .companyName(experience.getCompanyName())
                .jobTitle(experience.getJobTitle())
                .startDate(experience.getStartDate().toString())
                .endDate(experience.getEndDate().toString())
                .description(experience.getDescription())
                .build();
    }
    public EducationResponse toEducationResponse(Education education) {
        if (education == null) {return null; }
        return EducationResponse.builder()
                .educationId(education.getEducationId())
                .institutionName(education.getInstitutionName())
                .degree(education.getDegree())
                .fieldOfStudy(education.getFieldOfStudy())
                .startDate(education.getStartDate().toString())
                .endDate(education.getEndDate().toString())
                .build();
    }
    public ConnectionResponse toConnectionResponse(Connection connection) {
        if (connection == null) {return null; }
        return ConnectionResponse.builder()
                .connectionId(connection.getConnectionId())
                .sender(toUserResponse(connection.getSender()))
                .receiver(toUserResponse(connection.getReceiver()))
                .status(connection.getStatus().toString())
                .createdAt(connection.getCreatedAt().toString())
                .build();
    }
    public CommentResponse toCommentResponse(Comment comment) {
        if (comment == null) {return null; }
        return CommentResponse.builder()
                .commentId(comment.getCommentId())
                .author(toUserResponse(comment.getUser()))
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt().toString())
                .post(toPostResponse(comment.getPost()))
                .build();
    }
}
