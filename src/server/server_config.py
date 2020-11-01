import argparse
import os


arg_parser = argparse.ArgumentParser(
    description='Server for 3d-reconstruction')

arg_parser.add_argument(
    '--host', type=str, default='0.0.0.0',
    help='Host address'
)

arg_parser.add_argument(
    '--port', type=int, default=8081, help='Port'
)

args = arg_parser.parse_args()

# export these variable to other module
is_development = os.environ['FLASK_ENV'] == 'development'
app_name = '3d-reconstruction-server'
host = '127.0.0.1' if is_development else args.host
port = args.port
