from flask import Blueprint, jsonify, request
from sqlalchemy import exc, or_

from project.api.models import user
from project import db, bcrypt


auth_blueprint = Blueprint('auth', __name__)
