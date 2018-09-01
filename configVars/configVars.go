package configVars

import (
	"os"
	"encoding/json"
)

type Configuration struct {
	DB_CONNECTION_STRING string
	JWT_TOKEN_SECRET string
}

var Config Configuration

func InitConfigVars() {

	file, err := os.Open("./configVars/config.json") 
	if err != nil {  
		panic(err) 
	}  

	err = json.NewDecoder(file).Decode(&Config) 
	if err != nil {  
		panic(err) 
	}

}