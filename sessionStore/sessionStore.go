package sessionStore

import (
	"net/http"

	"github.com/gorilla/sessions"
)

var SessionStore *sessions.CookieStore
var Session *sessions.Session

func InitSessionStore(sessionKey string) {
	SessionStore = sessions.NewCookieStore([]byte(sessionKey))
}

func InitNewSession(r *http.Request) *sessions.Session {

	if Session != nil {
		return Session
	}

	Session, err := SessionStore.Get(r, "colorBook_user")

	if err != nil {
		panic(err)
	}
	return Session
}

// TODO:
func SetSessionValue(w http.ResponseWriter, r *http.Request, key, value string) {
	session := InitNewSession(r)
	session.Values[key] = value
	session.Save(r, w)
}

func GetSessionValue(w http.ResponseWriter, r *http.Request, key string) (string, bool) {
	session := InitNewSession(r)
	valWithOutType := session.Values[key]
	value, ok := valWithOutType.(string)

	if !ok {
		return "", false
	}
	return value, true
}
