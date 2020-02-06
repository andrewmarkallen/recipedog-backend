from flask import Blueprint, jsonify, request
from sqlalchemy import exc, or_

from project.api.models import User
from project import db, bcrypt


auth_blueprint = Blueprint('auth', __name__)


@auth_blueprint.route('/auth/register', methods=['POST'])
def register():
    post_data = request.get_json()
    response_object = {
        'message': 'Invalid payload.',
        'status': 'fail',
    }
    if not post_data:
        return jsonify(response_object), 400
    username = post_data.get('username')
    email = post_data.get('email')
    password = post_data.get('password')
    try:
        # check for existing user
        user = User.query.filter(
            or_(User.username == username, User.email == email)
        ).first()
        if not user:
            # add new user to the db
            new_user = User(
                username=username,
                email=email,
                password=password,
            )
            db.session.add(new_user)
            db.session.commit()
            # generate auth token
            auth_token = new_user.encode_auth_token(new_user.id)
            response_object['status'] = 'success'
            response_object['message'] = 'Successfully registered'
            response_object['auth_token'] = auth_token.decode()
            return jsonify(response_object), 201
        else:
            response_object['message'] = 'Sorry, that user already exists.'
            return jsonify(response_object), 400
    # handle errors
    except (exc.IntegrityError, ValueError):
        db.session.rollback()
        return jsonify(response_object), 400
