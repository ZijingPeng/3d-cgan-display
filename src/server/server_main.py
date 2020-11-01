from server_config import is_development, port, host, app_name
from flask import Flask, send_file
from gevent.pywsgi import WSGIServer
from blueprints.home import home
from blueprints.presets import presets
from blueprints.processor import processor
from blueprints.generator import generator

app = Flask(app_name)
app.register_blueprint(home)
app.register_blueprint(presets)
app.register_blueprint(processor, url_prefix='/api')
app.register_blueprint(generator, url_prefix='/api')


@app.route('/demo')
@app.route('/about')
@app.route('/')
def catch_all():
    return send_file('public/index.html')


if __name__ == '__main__':
    if is_development:
        app.run(host=host, port=port, debug=True)
    else:
        print('Listening at http://{}:{}'.format(host, port))
        server = WSGIServer((host, port), app)
        server.serve_forever()
