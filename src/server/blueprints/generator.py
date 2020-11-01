from flask import Blueprint, jsonify, request, abort
from http import HTTPStatus
import re
import base64
import numpy as np
from PIL import Image
import io
from model.src.test import *

generator = Blueprint('generator', __name__)

# TODO: precompile regex
regex = r"data:image\/(png|jpg|jpeg);base64,(.+)"


@generator.route('/generate', methods=['POST'])
def generate():
    if request.method != 'POST' or not request.is_json:
        abort(HTTPStatus.METHOD_NOT_ALLOWED)
        return
    req = request.get_json()
    image_base64_url: str = req['image']

    # TODO: 增加更多检查，如尺寸，格式。如果检查不合格则返回 BAD_REQUEST
    # 上传文件的接口需要格外小心

    matches = re.findall(regex, image_base64_url, re.MULTILINE | re.DOTALL)
    if matches and len(matches) == 1:
        match = matches[0]
        image_binary = base64.b64decode(match[1])

        size1 = 128, 128
        size2 = 32, 32

        img1 = Image.open(io.BytesIO(image_binary)).convert('L')

        #img1.thumbnail(size1)
        img_arry1 = np.asarray(img1)

        img2 = Image.open(io.BytesIO(image_binary))
        #img2.thumbnail(size2)
        img_arry2 = np.asarray(img2)
        img_arry2 = img_arry2[..., ::-1]

        data1 = test(img_arry1, img_arry2);

        #print(img_arry2.shape)
        # do what ever you want. eg. write binary to file
        return jsonify({
            'isSuccess': True,
            'message': 'success',
            'input': "input",
            'output': data1,
            'real': data1
        })
    else:
        return jsonify({
            'isSuccess': False,
            'message': 'unknown image url format',
        })
        return
