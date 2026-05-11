package com.infosys.backend.repository;

import com.infosys.backend.model.CustomerOrder;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {

    List<CustomerOrder> findByUserUserIdOrderByCreatedAtDesc(int userId);
}
