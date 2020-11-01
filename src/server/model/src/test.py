from model.src.trainer import *
import glob
import h5py
import json
import cv2
import base64
from io import BytesIO
import gzip

def scale(x):
    x = x / 255
    x = x * 2 - 1

    return x

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

# test
def test(pic1, pic2):

    stage1 = Stage1()
    pics = []
    pics2 = []

    #pic = cv2.imdecode(pic, 0)
    # resize single pic to the feed the network
    pic1 = scale(pic1)

    # When testing images download online, you had better use the following line in order to exclude light influences
    pic1 = cv2.dilate(pic1, np.ones((2, 2), np.uint8), iterations=3)

    pic1 = cv2.resize(pic1, (128, 128))
    #pic1 = cv2.cvtColor(pic1, cv2.COLOR_BGR2GRAY)
    pic1 = np.expand_dims(pic1, 3)
    print(pic1.shape)
    pics.append(pic1)

    #pic2 = cv2.imread(path, 1)
    pic2 = pic2 / 255
    pic2 = pic2[..., ::-1]

    # When testing images download online, you had better use the following line in order to exclude light influences
    pic = cv2.dilate(pic2, np.ones((2, 2), np.uint8), iterations=3)

    pic2 = cv2.resize(pic2, (32, 32))
    pics2.append(pic2)

    #_ = display_view(pics[4])

    #print(np.array(pics2).shape)
    sample1 = stage1.restore(np.array(pics), num=32, sess_path='model/checkpoints/stage1/dm3.ckpt')
    stage2 = Stage2()
    sample2 = stage2.restore(np.array(pics2), num=32, sess_path='model/checkpoints/stage2/dm2.ckpt')


    for i in range(0, len(sample1)):
        print(i)
        #_ = display_model(sample1[i], sample2[i])
        #_ = display_model(models1[i], models2[i])
        #_ = display_grey_model(sample1[i])
        # _ = display_color_model(sample2[i])


        json_file = '../out/demo-chair-{}-output.json'.format(i)
        #f = codecs.open(json_file, 'w', encoding='utf-8')
        x0 = np.squeeze(sample1[i]) > 0
        x0 = np.reshape(x0, (32, 32, 32))
        #x0 = x0.tolist()
        x1 = sample2[i]

        for x in range(0, 32):
            for y in range(0, 32):
                for z in range(0, 32):
                    if x0[x, y, z] <= 0:
                        for j in range(3):
                            x1[x, y, z][j] = 0
                    else:
                        for j in range(3):
                            x1[x, y, z][j] = int(x1[x, y, z][j]*255)

        data1 = {
            "dataStr": get_str(x0).decode("utf-8"),
            "color": x1.tolist(),
            "depth": 32,
            "width": 32,
            "height": 32
        }
        print(data1)

        return data1

        #json.dump(data1, f, sort_keys=True)
        #f.write("\n")
        #f.close()








