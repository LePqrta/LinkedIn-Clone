package com.mrvalevictorian.backend.mapper;

import com.mrvalevictorian.backend.dto.response.*;
import com.mrvalevictorian.backend.model.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring") // This makes it a Spring Bean (@Component)
public interface AppMapper {

    // User Mapping
    UserResponse toUserResponse(User user);

    // Skill Mapping
    @Mapping(target = "profileId", source = "id") // MapStruct handles naming mismatches
    SkillResponse toSkillResponse(Skill skill);

    // Profile Mapping
    // MapStruct automatically uses toUserResponse() for the nested 'user' field
    @Mapping(target = "id", source = "profileId")
    ProfileResponse toProfileResponse(Profile profile);

    // Post Mapping
    // MapStruct calls toString() on objects by default, which matches your manual logic
    @Mapping(target = "user", source = "user")
    PostResponse toPostResponse(Post post);

    // Job Mapping
    @Mapping(target = "recruiter", source = "user") // Renaming user -> recruiter
    JobResponse toJobResponse(Job job);

    // Experience Mapping
    ExperienceResponse toExperienceResponse(Experience experience);

    // Education Mapping
    EducationResponse toEducationResponse(Education education);

    // Connection Mapping
    ConnectionResponse toConnectionResponse(Connection connection);

    // Comment Mapping
    @Mapping(target = "author", source = "user") // Renaming user -> author
    CommentResponse toCommentResponse(Comment comment);
}