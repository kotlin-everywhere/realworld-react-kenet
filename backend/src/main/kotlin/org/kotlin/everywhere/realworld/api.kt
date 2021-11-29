package org.kotlin.everywhere.realworld

import kotlinx.serialization.Serializable
import org.kotlin.everywhere.net.Kenet
import org.kotlin.everywhere.net.invoke
import java.util.*

class Api : Kenet() {
    val signUp by c<SignUpReq, SignUpRes>()
    val signIn by c<SignInReq, SignInRes>()
}

@Serializable
class SignUpReq(val name: String, val email: String, val password: String)

@Serializable
class SignUpRes(val errors: List<String> = listOf())

@Serializable
class SignInReq(val email: String, val password: String)

@Serializable
data class Res<T : Any>(val errors: List<String>, val data: T? = null)

@Serializable
class SignInRes(val errors: List<String> = listOf(), val data: Data? = null) {
    @Serializable
    class Data(
        val name: String,
        val email: String,
        val note: String,
        val profilePictureUrl: String,
        val accessToken: String,
    )
}

fun Api.init() {
    signUp { req ->
        val emailTaken = users.any { it.email == req.email }
        if (emailTaken) {
            return@signUp SignUpRes(errors = listOf("That email is already taken"))
        }
        users.add(User(name = req.name, email = req.email, password = req.password))
        SignUpRes()
    }

    signIn { req ->
        val user = users.firstOrNull { it.email == req.email && it.password == req.password }
            ?: return@signIn SignInRes(errors = listOf("Email or password is worng"))

        val accessToken = UUID.randomUUID().toString()
        user.accessTokens.add(accessToken)
        SignInRes(data = SignInRes.Data(
           name = user.name,
           email = user.email,
           note = user.note,
           profilePictureUrl = user.profilePictureUrl,
           accessToken = accessToken,
        ))
    }
}

data class User(
    val name: String,
    val email: String,
    val password: String,
    val accessTokens: MutableList<String> = mutableListOf(),
    val note: String = "",
    val profilePictureUrl: String = "",
)

val users = mutableListOf<User>()