package dataStore



type User struct {
	Firstname string `json:"firstname"`
  Lastname string `json:"lastname"`
  Email string `json:"email"`
  PhoneNumber string `json:"phone_number"`
  Password string `json:"password"`
  StreetAddress string `json:"street_address"`
  City string `json:"city"`
  State string `json:"state"`
  ZipCode string `json:"zipcode"`
}

func (store *DBStore) CreateUser(user *User) error {
	// 'User' is a simple struct which has "species" and "description" attributes
	// THe first underscore means that we don't care about what's returned from
	// this insert query. We just want to know if it was inserted correctly,
	// and the error will be populated if it wasn't
  _, err := store.DB.Query(`INSERT INTO users(firstname, lastname, email, phone_number, 
    password, street_address, city, state, zipcode) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`, 
    user.Firstname, user.Lastname,
    user.Email, user.PhoneNumber,
    user.Password, user.StreetAddress,
    user.City, user.State, user.ZipCode)
	return err
}

func (store *DBStore) GetUsers() ([]*User, error) {
	// Query the database for all users, and return the result to the
	// `rows` object
	rows, err := store.DB.Query("SELECT firstname, lastname from users")
	// We return incase of an error, and defer the closing of the row structure
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Create the data structure that is returned from the function.
	// By default, this will be an empty array of users
	users := []*User{}
	for rows.Next() {
		// For each row returned by the table, create a pointer to a user,
		user := &User{}
		// Populate the `Firstname` and `Lastname` attributes of the user,
		// and return incase of an error
		if err := rows.Scan(&user.Firstname, &user.Lastname); err != nil {
			return nil, err
		}
		// Finally, append the result to the returned array, and repeat for
		// the next row
		users = append(users, user)
	}
	return users, nil
}

