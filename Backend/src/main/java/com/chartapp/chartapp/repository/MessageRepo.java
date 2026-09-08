package com.chartapp.chartapp.repository;

import com.chartapp.chartapp.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepo extends JpaRepository<Message,Integer> {

    @Query("""
SELECT m
FROM Message m
WHERE
(
    (m.sender.id = :userId AND m.receiver.id = :friendId)
    OR
    (m.sender.id = :friendId AND m.receiver.id = :userId)
)
AND m.messageShow = 'Enabled'
ORDER BY m.localDateTime ASC
""")
    List<Message> getConversation(
            @Param("userId") int userId,
            @Param("friendId") int friendId);



}
