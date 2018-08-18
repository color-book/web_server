package dataStore

import "github.com/twinj/uuid"


type User struct {
	Firstname string `json:"firstname"`
  Lastname string `json:"lastname"`
  Email string `json:"email"`
  PhoneNumber int `json:"phone_number"`
  Password string `json:"password"`
  StreetAddress string `json:"street_address"`
  City string `json:"city"`
  State string `json:"state"`
	ZipCode int `json:"zipcode"`
	Timezone string `json:"timezone"`
}

type Position struct {
	Id string `json:"id"`
	Name string `json:"name"`
}

func (store *DBStore) CreateUser(user *User) error {

	uuid.Init()

	// NewV4 generates a new RFC4122 version 4 UUID a cryptographically secure random UUID.
	uuid := uuid.NewV4()

	// 'User' is a simple struct which has "species" and "description" attributes
	// THe first underscore means that we don't care about what's returned from
	// this insert query. We just want to know if it was inserted correctly,
	// and the error will be populated if it wasn't
  _, err := store.DB.Query(`INSERT INTO users (uuid, first_name, last_name, email, phone_number, 
    password, street_address, city, state, zipcode, timezone) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`, 
    uuid, user.Firstname, user.Lastname,
    user.Email, user.PhoneNumber,
    user.Password, user.StreetAddress,
		user.City, user.State, user.ZipCode,
		user.Timezone)
	return err
}

func (store *DBStore) GetPositions() ([]*Position, error) {
	// Query the database for all users, and return the result to the
	// `rows` object
	rows, err := store.DB.Query("SELECT * from positions")
	// We return incase of an error, and defer the closing of the row structure
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Create the data structure that is returned from the function.
	// By default, this will be an empty array of users
	positions := []*Position{}
	for rows.Next() {
		// For each row returned by the table, create a pointer to a user,
		position := &Position{}
		// Populate the `Firstname` and `Lastname` attributes of the user,
		// and return incase of an error
		if err := rows.Scan(&position.Id, &position.Name); err != nil {
			return nil, err
		}
		// Finally, append the result to the returned array, and repeat for
		// the next row
		positions = append(positions, position)
	}
	return positions, nil
}

