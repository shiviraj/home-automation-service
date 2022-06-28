package com.automation.service

import com.automation.domain.ID_SEQUENCE_COLLECTION
import com.automation.domain.IdSequence
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.core.FindAndModifyOptions
import org.springframework.data.mongodb.core.ReactiveMongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.Update
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

enum class IdType(val length: Int) {
    TASK_ID(6),
}

@Service
class IdGeneratorService(
    @Autowired
    private val reactiveMongoTemplate: ReactiveMongoTemplate,
) {

    fun generateId(idType: IdType): Mono<String> {
        return reactiveMongoTemplate.findAndModify(
            Query.query(Criteria.where("_idType").`is`(idType)),
            Update().inc("sequence", 1),
            FindAndModifyOptions.options().returnNew(true).upsert(true),
            IdSequence::class.java,
            ID_SEQUENCE_COLLECTION
        ).map { idSequence ->
            idSequence.sequence.toString().padStart(idType.length, '0')
        }
    }
}
