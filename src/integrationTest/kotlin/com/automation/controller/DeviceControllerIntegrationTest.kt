package com.automation.controller

import com.automation.annotation.IntegrationTest
import com.automation.domain.Device
import com.automation.domain.State
import com.automation.repository.DeviceRepository
import com.automation.testUtils.assertNextWith
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.reactive.server.WebTestClient

@IntegrationTest
class DeviceControllerIntegrationTest(
    @Autowired private val webTestClient: WebTestClient,
    @Autowired private val deviceRepository: DeviceRepository,
) {
    @BeforeEach
    fun setup() {
        deviceRepository.deleteAll().block()
    }

    @AfterEach
    fun tearDown() {
        deviceRepository.deleteAll().block()
    }

    @Test
    fun `should update the device state`() {
        deviceRepository.save(Device(deviceId = "001", deviceName = "LED_BULB", state = State.OFF)).block()

        val returnResult = webTestClient.post()
            .uri("/devices/001/on")
            .exchange()
            .expectStatus()
            .isOk
            .expectBody(Device::class.java)
            .returnResult()
            .responseBody!!

        returnResult.getState() shouldBe State.ON
    }


}
