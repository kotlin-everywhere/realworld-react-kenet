package org.kotlin.everywhere.realworld

import kotlinx.serialization.Serializable
import org.kotlin.everywhere.net.Kenet
import org.kotlin.everywhere.net.invoke
import java.util.*

class Api : Kenet() {
    val signUp by c<SignUpReq, SignUpRes>()
    val signIn by c<SignInReq, SignInRes>()
    val updateProfile by c<UpdateProfileReq, UpdateProfileRes>()
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

interface AuthorizedReq {
    val accessToken: String
}

interface ErrorsRes {
    val errors: List<String>
}

inline fun <REQ : AuthorizedReq, reified RES : ErrorsRes> withUser(crossinline handler: (user: User, req: REQ) -> RES): (req: REQ) -> RES {
    return { req ->
        val user = users.firstOrNull { it.accessTokens.contains(req.accessToken) }
        if (user == null) {
            val constructors = RES::class.constructors
            constructors.last().call(listOf("Invalid access token"))
        } else {
            handler(user, req)
        }
    }
}

@Serializable
class UpdateProfileReq(
    override val accessToken: String,
    val name: String,
    val note: String,
    val profilePictureUrl: String,
    val email: String,
    val password: String
) : AuthorizedReq

@Serializable
class UpdateProfileRes(override var errors: List<String> = listOf()) : ErrorsRes

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
        SignInRes(
            data = SignInRes.Data(
                name = user.name,
                email = user.email,
                note = user.note,
                profilePictureUrl = user.profilePictureUrl,
                accessToken = accessToken,
            )
        )
    }

    updateProfile(withUser { user, req ->
        if (req.name.isBlank()) {
            return@withUser UpdateProfileRes(errors = listOf("Input a name"))
        }

        if (req.password.isNotBlank()) {
            if (req.email != user.email) {
                return@withUser UpdateProfileRes(errors = listOf("invalid email"))
            }
            user.password = req.password
        }

        user.name = req.name
        user.note = req.note
        user.profilePictureUrl = req.profilePictureUrl

        UpdateProfileRes()
    })
}

data class User(
    var name: String,
    val email: String,
    var password: String,
    val accessTokens: MutableList<String> = mutableListOf(),
    var note: String = "",
    var profilePictureUrl: String = "",
)

val users = mutableListOf(User(name = "test", email = "admin@example.com", password = "1234"))