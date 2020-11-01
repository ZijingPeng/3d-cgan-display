import json
import base64
from io import BytesIO
import gzip

"""
Convert 3D model from array format to gzip+base64

This script is under construction.
"""


def get_str(model):
    out = BytesIO()
    with gzip.GzipFile(fileobj=out, mode="w") as f:
        for i in range(32):
            for j in range(32):
                for k in range(32):
                    if model[i][j][k] == 1:
                        f.write(b'1')
                    else:
                        f.write(b'0')
    a = out.getvalue()
    return base64.b64encode(a)


def main():
    with open('demo-chair.json', 'r') as fd:
        jd = json.load(fd)
        model0 = jd['model0']
        print(get_str(model0))
        model1 = jd['model1']
        print(get_str(model1))


if __name__ == "__main__":
    main()
