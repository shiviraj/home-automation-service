import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	id("org.springframework.boot") version "2.5.3"
	id("io.spring.dependency-management") version "1.0.11.RELEASE"
	kotlin("jvm") version "1.6.21"
	kotlin("plugin.spring") version "1.6.21"
	idea
	jacoco
}

group = "com.automation"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_11

repositories {
	mavenCentral()
}

dependencies {
//	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-data-mongodb-reactive")
	implementation("org.springframework.boot:spring-boot-starter-webflux")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("io.projectreactor.kotlin:reactor-kotlin-extensions")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
	implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor")
	testImplementation("io.kotest:kotest-runner-junit5-jvm:5.3.1")
	testImplementation("io.kotest:kotest-assertions-core-jvm:5.3.1")
	testImplementation("de.flapdoodle.embed:de.flapdoodle.embed.mongo:3.4.6")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("io.projectreactor:reactor-test")
	testImplementation("io.mockk:mockk:1.12.4")
//	testImplementation("org.springframework.security:spring-security-test")
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs = listOf("-Xjsr305=strict")
		jvmTarget = "11"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}


sourceSets.create("integrationTest") {
	withConvention(org.jetbrains.kotlin.gradle.plugin.KotlinSourceSet::class) {
		kotlin.srcDir("src/integrationTest/kotlin")
		compileClasspath += sourceSets.main.get().output + configurations.testCompileClasspath
		runtimeClasspath += output + compileClasspath + configurations.testRuntimeClasspath
	}
	resources.srcDir("src/integrationTest/resources")
}


tasks.register<Test>("integrationTest") {
	useJUnitPlatform()
	testClassesDirs = sourceSets.getByName("integrationTest").output.classesDirs
	classpath = sourceSets.getByName("integrationTest").runtimeClasspath
}

tasks.register<Delete>("cleanIntegrationTest") {
	delete.add("build/classes/kotlin/integrationTest")
	delete.add("build/kotlin/compileIntegrationTestKotlin")
	delete.add("build/reports/tests/integrationTest")
	delete.add("build/resources/integrationTest")
	delete.add("build/test-results/integrationTest")
}

