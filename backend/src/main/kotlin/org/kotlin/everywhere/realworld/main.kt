package org.kotlin.everywhere.realworld

import org.kotlin.everywhere.net.HttpServerEngine
import org.kotlin.everywhere.net.createServer
import org.kotlin.everywhere.net.gen.typescript.generate
import java.nio.file.Path

suspend fun main(args: Array<String>) {
    val command = parseArgs(args) ?: throw usage()

    val api = Api().apply { init() }

    when (command) {
        is Generate -> {
            generate(api, Path.of(command.destination), "api")
        }
        is Serve -> {
            createServer(api, HttpServerEngine()).launch(command.port)
        }
    }

}

private fun parseArgs(args: Array<String>): Command? {
    return when (args.firstOrNull()) {
        "generate" -> args.getOrNull(1)?.let { Generate(it) }
        "serve" -> Serve(args.getOrElse(1) { "5000" }.toInt())
        else -> null
    }
}

sealed class Command
data class Generate(val destination: String) : Command()
data class Serve(val port: Int) : Command()

private fun usage(): IllegalArgumentException {
    return IllegalArgumentException(
        """
            require command to execute.
            1) generate 
                require an argument for destination directory.
                ex: generate ../frontend/api
            2) serve
                start kenet server with port, port is optional.
                ex: serve 5000
                
        """.trimIndent()
    )
}

