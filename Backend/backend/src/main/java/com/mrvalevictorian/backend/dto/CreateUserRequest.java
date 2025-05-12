package com.mrvalevictorian.backend.dto;


import lombok.Data;

@Data
public class CreateUserRequest {

    private String username;
    private String password;
    private String email;
    private String name;
    private String surname;

}
//dto'larda getter yada setter koymana gerek yok @Data olduğu sürece
//getter setter'ı otomatik oluşturuyor
