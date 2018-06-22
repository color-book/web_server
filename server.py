from flask import Flask
from flask_cors import CORS
import logging
import config
# from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)
app.secret_key = config.secret_key
CORS(app)
# csrf = CSRFProtect()
# csrf.init_app(app)

# import login
import routes

app.config.from_envvar('COLORBOOK_SETTINGS')
gunicorn_error_logger = logging.getLogger('gunicorn.error')
app.logger.handlers.extend(gunicorn_error_logger.handlers)
login.init_app(app)

if __name__ == '__main__':
    app.run()