from functools import wraps
from flask import request, jsonify
from project.api.models import User
from urllib.parse import urlencode
from urllib.request import urlopen
import json
import os


def authenticate(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        response_object = {
            'status': 'fail',
            'message': 'Provide a valid auth token.'
        }
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify(response_object), 403
        auth_token = auth_header.split(" ")[1]
        resp = User.decode_auth_token(auth_token)
        if isinstance(resp, str):
            response_object['message'] = resp
            return jsonify(response_object), 401
        user = User.query.filter_by(id=resp).first()
        if not user or not user.active:
            return jsonify(response_object), 401
        return f(resp, *args, **kwargs)
    return decorated_function


def is_admin(user_id):
    user = User.query.filter_by(id=user_id).first()
    return user.admin


def response_failure(message, code, dict=None):
    response_object = {
        'status': 'fail',
        'message': message
    }
    if dict is not None:
        response_object.update(dict)
    return jsonify(response_object), code


def response_success(message, code, dict=None):
    response_object = {
        'status': 'success',
        'message': message
    }
    if dict is not None:
        response_object.update(dict)
    return jsonify(response_object), code


def delete_image(filename):
    pass


def validate_recaptcha(response):
    URIReCaptcha = 'https://www.google.com/recaptcha/api/siteverify'
    private_recaptcha = os.getenv('RECAPTCHA_SECRET_KEY')
    params = urlencode({
        'secret': private_recaptcha,
        'response': response,
    })

    data = urlopen(URIReCaptcha, params.encode('utf-8')).read()
    result = json.loads(data)
    result = {
        'user_response': response,
        'captcha_response': json.loads(data)
    }
    return result
