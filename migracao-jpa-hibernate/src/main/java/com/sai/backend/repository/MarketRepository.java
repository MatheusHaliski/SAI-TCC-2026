package com.sai.backend.repository;

import com.sai.backend.entity.Market;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketRepository extends JpaRepository<Market, Long> {

    List<Market> findByGender(String gender);

    List<Market> findBySeason(String season);

    List<Market> findBySeasonAndGender(String season, String gender);
}
