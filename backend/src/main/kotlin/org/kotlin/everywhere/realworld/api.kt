package org.kotlin.everywhere.realworld

import kotlinx.serialization.Serializable
import org.kotlin.everywhere.net.Call
import org.kotlin.everywhere.net.Kenet
import org.kotlin.everywhere.net.invoke
import java.util.*
import kotlin.reflect.full.findParameterByName
import kotlin.reflect.full.primaryConstructor

class Api : Kenet() {
    val signUp by c<SignUpReq, SignUpRes>()
    val signIn by c<SignInReq, SignInRes>()

    // my pages
    val basicUserInfo by c<BasicUserInfoReq, BasicUserInfoRes>()
    val updateProfile by c<UpdateProfileReq, UpdateProfileRes>()

    // articles
    val articleCreate by c<ArticleCreateReq, ArticleCreateRes>()
    val articleEditShow by c<ArticleEditShowReq, ArticleEditShowRes>()
    val articleEdit by c<ArticleEditReq, ArticleEditRes>()
    val articleShow by c<ArticleShowReq, ArticleShowRes>()

    // index
    val feedList by c<FeedListReq, FeedListRes>()
}

@Serializable
class SignUpReq(val name: String, val email: String, val password: String)

@Serializable
class SignUpRes(val errors: List<String> = listOf())

@Serializable
class SignInReq(val email: String, val password: String)

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

@Serializable
class BasicUserInfoReq(val accessToken: String)

@Serializable
class BasicUserInfoRes(val data: Data? = null) {
    @Serializable
    class Data(val name: String, val email: String, val note: String, val profilePictureUrl: String)
}

interface AuthorizedReq {
    val accessToken: String
}

interface ErrorsRes {
    val errors: List<String>
}

private inline fun <REQ : AuthorizedReq, reified RES : ErrorsRes> Call<REQ, RES>.withUser(crossinline handler: (user: User, req: REQ) -> RES) {
    invoke { req ->
        val user = users.firstOrNull { it.accessTokens.contains(req.accessToken) }
        if (user == null) {
            val cons =
                RES::class.primaryConstructor ?: throw IllegalArgumentException("cannot find primary constructor")
            val errorsParameterName =
                cons.findParameterByName("errors") ?: throw IllegalArgumentException("Cannot find errors parameter")
            cons.callBy(mapOf(errorsParameterName to listOf("invalid access token")))
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


@Serializable
class ArticleCreateReq(
    override val accessToken: String,
    val title: String,
    val description: String,
    val article: String,
    val tags: String
) : AuthorizedReq

@Serializable
class ArticleCreateRes(override val errors: List<String> = listOf(), val slug: String? = null) : ErrorsRes

@Serializable
class ArticleEditShowReq(
    override val accessToken: String,
    val slug: String
) : AuthorizedReq

@Serializable
class ArticleEditShowRes(override val errors: List<String> = listOf(), val data: Data? = null) : ErrorsRes {
    @Serializable
    class Data(
        val pk: Int,
        val title: String,
        val description: String,
        val article: String,
        val tags: List<String>
    )
}

@Serializable
class ArticleEditReq(
    override val accessToken: String,
    val pk: Int,
    val title: String,
    val description: String,
    val article: String,
    val tags: String
) : AuthorizedReq

@Serializable
class ArticleEditRes(override val errors: List<String> = listOf(), val slug: String? = null) : ErrorsRes

@Serializable
class ArticleShowReq(val slug: String)

@Serializable
class ArticleShowRes(val data: Data? = null) {
    @Serializable
    class Data(
        val userPk: Int?,
        val userName: String?,
        val userProfilePictureUrl: String?,
        val pk: Int,
        val title: String,
        val description: String,
        val article: String,
        val tags: List<String>,
        val lastUpdatedAt: String,
    )
}

@Serializable
class FeedListReq(val accessToken: String?)

@Serializable
class FeedListRes(val feeds: List<Feed>) {
    @Serializable
    class Feed(
        val userName: String,
        val userProfilePictureUrl: String,
        val lastUpdatedAt: String,
        val title: String,
        val description: String,
        val slug: String
    )
}

fun Api.init() {
    signUp { req ->
        val emailTaken = users.any { it.email == req.email }
        if (emailTaken) {
            return@signUp SignUpRes(errors = listOf("That email is already taken"))
        }
        users.add(User(pk = ++lastUserPk, name = req.name, email = req.email, password = req.password))
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

    basicUserInfo { req ->
        val user =
            users.firstOrNull { it.accessTokens.contains(req.accessToken) }
                ?: return@basicUserInfo BasicUserInfoRes()
        BasicUserInfoRes(data = BasicUserInfoRes.Data(
            name = user.name,
            email = user.email,
            note = user.note,
            profilePictureUrl = user.profilePictureUrl
        ))
    }

    updateProfile.withUser { user, req ->
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
    }

    articleCreate.withUser { user, req ->
        if (req.title.isBlank()) {
            return@withUser ArticleCreateRes(listOf("Input a title"))
        }
        if (req.article.isBlank()) {
            return@withUser ArticleCreateRes(listOf("Input an article"))
        }

        val newArticle = Article(
            pk = ++lastArticlePk,
            slug = req.title.slugify(),
            userPk = user.pk,
            title = req.title,
            description = req.description,
            article = req.article,
            tags = req.tags.split(",").map { it.trim() }
        )
        if (articles.any { it.slug == newArticle.slug }) {
            // 만약 slug 가 사용중이면 pk 를 붙여 준다.
            newArticle.slug = "${newArticle.slug}_${newArticle.pk}"
        }
        articles.add(newArticle)

        ArticleCreateRes(slug = newArticle.slug)
    }
    articleEditShow.withUser { user, req ->
        val article = articles.firstOrNull { it.slug == req.slug && it.userPk == user.pk }
            ?: return@withUser ArticleEditShowRes(errors = listOf("Invalid article"))
        ArticleEditShowRes(
            data = ArticleEditShowRes.Data(
                pk = article.pk,
                title = article.title,
                description = article.description,
                article = article.article,
                tags = article.tags
            )
        )
    }

    articleEdit.withUser { user, req ->
        if (req.title.isBlank()) {
            return@withUser ArticleEditRes(errors = listOf("Input a title"))
        }
        if (req.article.isBlank()) {
            return@withUser ArticleEditRes(errors = listOf("Input a article"))
        }

        val article = articles.firstOrNull { it.pk == req.pk && it.userPk == user.pk }
            ?: return@withUser ArticleEditRes(errors = listOf("Not found an article"))

        article.slug = req.title.slugify()
        if (articles.filter { it.pk != req.pk }.any { it.slug == article.slug }) {
            // 만약 slug 가 사용중이면 pk 를 붙여 준다.
            article.slug = "${article.slug}_${article.pk}"
        }
        article.title = req.title
        article.description = req.description
        article.article = req.article
        article.tags = req.tags.split(",").map { it.trim() }
        article.updatedAt = Date()

        ArticleEditRes(slug = article.slug)
    }

    articleShow { req ->
        val article = articles.firstOrNull { it.slug == req.slug } ?: return@articleShow ArticleShowRes()
        val articleUser = users.firstOrNull { it.pk == article.userPk }
        ArticleShowRes(data = ArticleShowRes.Data(
            userPk = articleUser?.pk,
            userName = articleUser?.name,
            userProfilePictureUrl = articleUser?.profilePictureUrl,
            pk = article.pk,
            title = article.title,
            description = article.description,
            article = article.article,
            tags = article.tags,
            lastUpdatedAt = (article.updatedAt ?: article.createdAt).toString()
        ))
    }

    feedList { req ->
        val user = users.firstOrNull { it.accessTokens.contains(req.accessToken) }
        val feeds = articles
            .filter { user == null || it.userPk == user.pk }
            .map { article ->
                val articleUser = users.firstOrNull { article.userPk == it.pk }
                FeedListRes.Feed(
                    userName = articleUser?.name ?: "Unkown User",
                    userProfilePictureUrl = articleUser?.profilePictureUrl ?: "",
                    lastUpdatedAt = (article.updatedAt ?: article.createdAt).toString(),
                    title = article.title,
                    description = article.description,
                    slug = article.slug
                )
            }
        FeedListRes(feeds = feeds)
    }
}

var lastUserPk = 0

data class User(
    val pk: Int,
    var name: String,
    val email: String,
    var password: String,
    val accessTokens: MutableList<String> = mutableListOf(),
    var note: String = "",
    var profilePictureUrl: String = "",
)

private val users =
    mutableListOf(User(pk = ++lastUserPk, name = "test", email = "admin@example.com", password = "1234"))

private var lastArticlePk = 0

data class Article(
    val pk: Int,
    var slug: String,
    val userPk: Int,
    var title: String,
    var description: String,
    var article: String,
    var tags: List<String>,
    var createdAt: Date = Date(),
    var updatedAt: Date? = null
)

private val articles =
    mutableListOf(
        Article(
            pk = ++lastArticlePk,
            slug = "first",
            userPk = 1,
            title = "First",
            description = "Description",
            article = "Article",
            tags = listOf("One", "Two")
        )
    )


// TODO :: correct slug
fun String.slugify(): String =
    this.lowercase()
        .replace("-_".toRegex(), " ")
        .split(' ')
        .asSequence()
        .map { it.trim() }
        .filter { it.isNotBlank() }
        .joinToString("-")