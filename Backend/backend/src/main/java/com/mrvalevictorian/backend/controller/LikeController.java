package com.mrvalevictorian.backend.controller;


import com.mrvalevictorian.backend.dto.LikeRequest;
import com.mrvalevictorian.backend.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/like")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/like-post")
    public void likePost(@RequestBody LikeRequest request)  {
        System.out.println("Like request: " + request);
            likeService.likePost(request);



    }

}
