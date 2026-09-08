package com.chartapp.chartapp.repository;

import com.chartapp.chartapp.entity.Relation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RelationRepo extends JpaRepository<Relation,Integer> {

    List<Relation>findByOwner_Id(int userId);

    @Query("""
        SELECT r.status
        FROM Relation r
        WHERE r.owner.id = :ownerId
        AND r.contact.id = :contactId
    """)
    String findStatus(@Param("ownerId") int ownerId,@Param("contactId") int contactId);

    @Query("""
            SELECT r from Relation r
            where r.owner.id=:ownerId
            and r.contact.id=:contactId
            """)
    Relation findRelation
            (@Param("ownerId")int ownerId,@Param("contactId")int contactId);

    Optional<Relation>findByOwner_IdAndContact_Id(int ownerId,int contactId);

}
