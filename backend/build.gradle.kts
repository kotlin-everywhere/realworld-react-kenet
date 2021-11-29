plugins {
    kotlin("jvm") version "1.5.31"
    kotlin("plugin.serialization") version "1.5.31"
    application
}

application {
    mainClass.set("org.kotlin.everywhere.realworld.MainKt")
}

repositories {
    mavenCentral()
    maven(url = "https://jitpack.io")
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    kotlinOptions {
        jvmTarget = "16"
    }
}

dependencies {
    // kenet
    val kenetVersion = "619d409526"
    implementation("com.github.kotlin-everywhere.kenet:kenet-server:$kenetVersion")
    implementation("com.github.kotlin-everywhere.kenet:kenet-server-engine-http:$kenetVersion")
    implementation("com.github.kotlin-everywhere.kenet:kenet-gen-typescript:$kenetVersion")
    implementation(kotlin("reflect"))
}