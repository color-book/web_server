package handlers

import (
	"html/template"
	"net/http"

	"github.com/color-book/web_server/sessionStore"
)

func RenderLogin(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/login" {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	tmpl := template.Must(template.ParseFiles("./templates/login.html"))

	tmpl.Execute(w, "")

}

func RenderDashboard(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/dashboard" {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	tmpl := template.Must(template.ParseFiles("./templates/dashboard-layout.html", "./templates/dashboard.html"))

	tmpl.Execute(w, "")

}

func RenderCreateAJob(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/dashboard/create-a-job" {
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		return
	}

	tmpl := template.Must(template.ParseFiles("./templates/dashboard-layout.html", "./templates/create-a-job.html"))

	tmpl.Execute(w, "")

}

func Logout(w http.ResponseWriter, r *http.Request) {
	sessionStore.SetSessionValue(w, r, "user_token_string", "")
	http.Redirect(w, r, "/login", http.StatusSeeOther)
	// tmpl := template.Must(template.ParseFiles("./templates/login.html"))

	// tmpl.Execute(w, "")
}
