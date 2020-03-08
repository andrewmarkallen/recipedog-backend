from uuid import uuid4
from os.path import splitext, join
from flask import (Blueprint, jsonify, request, redirect,
                   flash)
from werkzeug.utils import secure_filename
from pathlib import Path
from flask import current_app, logging

images_folder = Path("images/")

ALLOWED_EXTENSIONS = {'jpg', 'png', 'jpeg', 'gif'}


images_blueprint = Blueprint('images', __name__)


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@images_blueprint.route('/upload', methods=['GET', 'POST'])
def upload_file():
    response_object = {
        'status': 'fail',
        'filename': 'File not added'
    }
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return jsonify(response_object), 400
        file = request.files['file']
        # if user does not select file,  browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            response_object['filename'] = 'no filename'
            return jsonify(response_object), 400
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            (path, ext) = splitext(filename)
            hashed_filename = uuid4().hex
            file.save(images_folder/(hashed_filename + ext))
            response_object['status'] = 'success'
            response_object['filename'] = hashed_filename + ext
            return jsonify(response_object), 200
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
        <input type=file name=file>
        <input type=submit value=Upload>
    </form>
    '''
