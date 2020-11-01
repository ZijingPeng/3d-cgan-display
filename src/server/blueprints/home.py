from flask import Blueprint, send_from_directory

home = Blueprint('home', __name__)


# serve static files
@home.route('/<filename>')
def index(filename):
    return send_from_directory('public', filename)
