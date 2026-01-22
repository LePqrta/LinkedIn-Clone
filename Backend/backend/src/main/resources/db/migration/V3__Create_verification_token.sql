CREATE TABLE verification_token (
                                    id BIGSERIAL PRIMARY KEY,
                                    token VARCHAR(255) NOT NULL,
                                    user_id UUID NOT NULL,
                                    expiry_date TIMESTAMP NOT NULL,
                                    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);