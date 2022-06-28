package com.automation

import com.automation.service.TaskService
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.builder.SpringApplicationBuilder
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.data.mongodb.config.EnableMongoAuditing
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.EnableTransactionManagement


@SpringBootApplication
@EnableMongoAuditing
@EnableScheduling
@EnableTransactionManagement
@ConfigurationPropertiesScan
class AutomationApplication {
    companion object {
        @JvmStatic
        fun main(args: Array<String>) {
            SpringApplicationBuilder(AutomationApplication::class.java).run(*args)
        }
    }
}

@Service
class Scheduler(private val taskService: TaskService) : CommandLineRunner {
    val delayInMillis: Long = 60000
    override fun run(vararg args: String?) {
        taskService.performTasks().blockLast();
        Thread.sleep(delayInMillis)
        run()
    }

}
