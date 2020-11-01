import glob
import os
from flask import Blueprint, send_from_directory, jsonify
from server_config import host, port

presets = Blueprint('presets', __name__)

preset_url_prefix = 'presets/'.format(host, port)
png_asset_path_list = glob.glob('assets/*.png')
preset_filename_list = [
    preset_url_prefix +
    os.path.basename(filename) for filename in png_asset_path_list
]


# serve static assets
@presets.route('/presets/<filename>')
def index(filename):
    return send_from_directory('assets', filename)


@presets.route('/api/presets')
def get_presets():
    return jsonify(preset_filename_list)
