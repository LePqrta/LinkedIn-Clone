package com.mrvalevictorian.backend.repo;

import com.mrvalevictorian.backend.model.Entry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EntryRepo extends JpaRepository<Entry, Long> {

}
