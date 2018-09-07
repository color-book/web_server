package handlers

import (
	"net/http"
	"html/template"
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