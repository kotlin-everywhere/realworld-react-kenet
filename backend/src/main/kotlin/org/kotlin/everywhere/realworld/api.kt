package org.kotlin.everywhere.realworld

import org.kotlin.everywhere.net.Kenet
import org.kotlin.everywhere.net.invoke

class Api : Kenet() {
    val greeting by c<String, String>()
}

fun Api.init() {
    greeting {
        "Hello, named = $it!"
    }
    println("greeting = $greeting")
}