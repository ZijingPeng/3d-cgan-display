import re
import os
import json
from glob import glob
from flask import Blueprint, jsonify, request, abort
from http import HTTPStatus

processor = Blueprint('processor', __name__)

re_get_input_id = re.compile(r"presets/demo-chair-(\d+)-input\.png")

# before serving, we should read *-output.json and *-real.json into memory
models = {}
output_files = glob('output/*.json')
real_files = glob('real/*.json')

for filename in output_files + real_files:
    with open(filename, encoding='utf-8') as fd:
        basename = os.path.basename(filename)
        models[basename] = json.load(fd)


@processor.route('/process', methods=['POST'])
def process():
    if request.method != 'POST':
        abort(HTTPStatus.METHOD_NOT_ALLOWED)

    # we don't need image_base64 before next version which supports upload
    # image_base64 = request.values['input']

    # input_name pattern like 'demo-chair-<id>-input.png'
    input_name = request.json['input_name']

    # get input id from input_name
    input_id_list = re_get_input_id.findall(input_name)

    if len(input_id_list) == 0:
        return jsonify({
            'isSuccess': False,
            'message': '101',  # hide real error message
            'input': input_name,
            'output': None,
            'real': None
        })
    input_id = int(input_id_list[0])

    output_key = 'demo-chair-{}-output.json'.format(input_id)
    real_key = 'demo-chair-{}-real.json'.format(input_id)

    if output_key in models.keys() and real_key in models.keys():
        return jsonify({
            'isSuccess': True,
            'message': 'success',
            'input': input_name,
            'output': models[output_key],
            'real': models[real_key]
        })

    return jsonify({
        'isSuccess': False,
        'message': '102',
        'input': input_name,
        'output': None,
        'real': None
    })
